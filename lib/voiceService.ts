import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { ELEVENLABS_CONFIG, AI_CONFIG } from './elevenlabs';

type VoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

interface VoiceServiceCallbacks {
  onStateChange: (state: VoiceState) => void;
  onTranscript: (text: string, isUser: boolean) => void;
  onError: (error: string) => void;
}

// ElevenLabs voices - using a nice conversational voice
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - friendly female voice

class VoiceService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private callbacks: VoiceServiceCallbacks | null = null;
  private conversationHistory: { role: string; content: string }[] = [];

  async initialize(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
    this.conversationHistory = [];

    // Request audio permissions
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      callbacks.onError('Microphone permission denied');
      return false;
    }

    // Configure audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return true;
  }

  async startListening() {
    this.callbacks?.onStateChange('listening');

    try {
      // Stop any existing recording
      if (this.recording) {
        try {
          const status = await this.recording.getStatusAsync();
          if (status.isRecording) {
            await this.recording.stopAndUnloadAsync();
          }
        } catch (e) {
          // Ignore - recorder might already be unloaded
          console.log('Cleanup of previous recording:', e);
        }
        this.recording = null;
      }

      // Create new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.recording = null;
      this.callbacks?.onError('Failed to start microphone');
      this.callbacks?.onStateChange('idle');
    }
  }

  async stopListening() {
    if (!this.recording) {
      console.log('No recording to stop');
      return;
    }

    this.callbacks?.onStateChange('processing');

    try {
      console.log('Stopping recording...');

      // Check if recording is still valid before stopping
      const status = await this.recording.getStatusAsync();
      if (!status.isRecording && !status.isDoneRecording) {
        console.log('Recording not in valid state, cleaning up');
        this.recording = null;
        this.callbacks?.onStateChange('idle');
        return;
      }

      // Get URI before stopping (in case stop fails)
      const uri = this.recording.getURI();

      // Only stop if still recording
      if (status.isRecording) {
        await this.recording.stopAndUnloadAsync();
      }

      this.recording = null;

      if (uri) {
        console.log('Recording URI:', uri);
        await this.processAudio(uri);
      } else {
        console.log('No URI from recording');
        this.callbacks?.onStateChange('idle');
      }
    } catch (error: any) {
      console.error('Error stopping recording:', error);
      // Always clean up the recording reference on error
      this.recording = null;

      // Don't show error for "Recorder does not exist" - just clean up
      if (error?.message?.includes('Recorder does not exist')) {
        console.log('Recorder already cleaned up');
        this.callbacks?.onStateChange('idle');
        return;
      }

      this.callbacks?.onError('Recording failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  private async processAudio(uri: string) {
    try {
      console.log('Processing audio from:', uri);

      // Transcribe audio using Whisper API
      const userMessage = await this.transcribeAudio(uri);

      if (!userMessage || userMessage.trim().length === 0) {
        console.log('No speech detected');
        this.callbacks?.onError('No speech detected');
        this.callbacks?.onStateChange('idle');
        return;
      }

      console.log('Transcribed:', userMessage);
      this.callbacks?.onTranscript(userMessage, true);

      // Get AI response
      const aiResponse = await this.getAIResponse(userMessage);
      console.log('AI Response:', aiResponse);

      this.callbacks?.onTranscript(aiResponse, false);

      // Convert to speech using ElevenLabs TTS
      await this.speakText(aiResponse);

    } catch (error) {
      console.error('Error processing audio:', error);
      this.callbacks?.onError('Processing failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  private async transcribeAudio(uri: string): Promise<string> {
    const hasGroqKey = AI_CONFIG.groqApiKey && AI_CONFIG.groqApiKey.length > 10;
    const hasOpenAIKey = AI_CONFIG.openaiApiKey && AI_CONFIG.openaiApiKey.length > 10;

    if (!hasGroqKey && !hasOpenAIKey) {
      console.log('No API key for transcription');
      throw new Error('No API key configured for speech-to-text');
    }

    try {
      // Create form data with file URI (React Native style)
      const formData = new FormData();

      // React Native FormData accepts file objects with uri, type, name
      formData.append('file', {
        uri: uri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);

      let response: Response;

      if (hasGroqKey) {
        // Use Groq Whisper API
        console.log('Transcribing with Groq Whisper...');
        formData.append('model', 'whisper-large-v3');
        response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.groqApiKey}`,
          },
          body: formData,
        });
      } else {
        // Use OpenAI Whisper API
        console.log('Transcribing with OpenAI Whisper...');
        formData.append('model', 'whisper-1');
        response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
          },
          body: formData,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Whisper API error:', response.status, errorText);
        throw new Error(`Transcription failed: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  private async getAIResponse(userMessage: string): Promise<string> {
    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    // System prompt for the travel assistant
    const systemPrompt = `You are Hasio, a friendly and knowledgeable travel assistant. You help users:
- Find hotels and accommodations
- Discover restaurants and local food
- Plan trips and itineraries
- Learn about destinations and attractions
- Get travel tips and recommendations

Be concise (2-3 sentences max), helpful, and enthusiastic. If asked about specific places like Riyadh, Dubai, Paris, etc., give relevant local recommendations. Always be specific and actionable in your responses.`;

    // Check if we have an API key configured
    const hasGroqKey = AI_CONFIG.groqApiKey && AI_CONFIG.groqApiKey.length > 10;
    const hasOpenAIKey = AI_CONFIG.openaiApiKey && AI_CONFIG.openaiApiKey.length > 10;

    if (!hasGroqKey && !hasOpenAIKey) {
      // Fallback to smart static responses if no API key
      return this.getFallbackResponse(userMessage);
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      let response: Response;

      if (hasGroqKey) {
        // Use Groq API (faster, free tier available)
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            max_tokens: 150,
            temperature: 0.7,
          }),
        });
      } else {
        // Use OpenAI API
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 150,
            temperature: 0.7,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);

      // Add to conversation history
      this.conversationHistory.push({ role: 'assistant', content: aiMessage });

      return aiMessage;
    } catch (error) {
      console.error('Error calling AI API:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Smart fallback responses based on keywords
    if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
      if (lowerMessage.includes('riyadh') || lowerMessage.includes('riad')) {
        return "For Riyadh, I recommend checking out the Four Seasons at Kingdom Centre for luxury, or the Narcissus Hotel for a great mid-range option. The Diplomatic Quarter area is perfect for business travelers!";
      }
      if (lowerMessage.includes('dubai')) {
        return "Dubai has amazing hotels! The Burj Al Arab is iconic for luxury, Address Downtown for stunning Burj Khalifa views, or Rove Hotels for stylish budget options.";
      }
      return "I can help you find great hotels! What city are you traveling to, and what's your preferred budget range?";
    }

    if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
      if (lowerMessage.includes('riyadh') || lowerMessage.includes('riad')) {
        return "Riyadh has incredible dining! Try Najd Village for authentic Saudi cuisine, LPM for French-Mediterranean, or The Globe at Al Faisaliah for stunning views while dining.";
      }
      return "I know amazing restaurants! Which city are you interested in, and do you prefer local cuisine or international options?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm Hasio, your travel assistant. I can help you find hotels, restaurants, and plan amazing experiences. What destination are you interested in?";
    }

    if (lowerMessage.includes('trip') || lowerMessage.includes('plan') || lowerMessage.includes('visit')) {
      return "I'd love to help plan your trip! Tell me where you're thinking of going, and I'll suggest the best hotels, restaurants, and things to do.";
    }

    return "I'm here to help with your travel plans! You can ask me about hotels, restaurants, or trip planning for any destination.";
  }

  private async speakText(text: string) {
    this.callbacks?.onStateChange('speaking');

    try {
      console.log('Generating speech for:', text.substring(0, 50) + '...');

      // Call ElevenLabs TTS API
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_CONFIG.apiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        throw new Error(`TTS failed: ${response.status}`);
      }

      console.log('Got audio response from ElevenLabs');

      // Get the audio as array buffer and convert to base64
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Audio = btoa(binary);

      // Use temp file with timestamp to avoid conflicts, auto-cleanup
      const audioUri = FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`;
      await FileSystem.writeAsStringAsync(audioUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Playing audio...');

      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Play the audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: 1.0 }
      );

      this.sound = sound;
      console.log('Playing audio...');

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('Finished playing');
          this.callbacks?.onStateChange('idle');
          // Clean up temp file
          try {
            await FileSystem.deleteAsync(audioUri, { idempotent: true });
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      });

    } catch (error) {
      console.error('Error in TTS:', error);
      this.callbacks?.onError('Speech generation failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  async disconnect() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }

    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }

    this.conversationHistory = [];
    this.callbacks?.onStateChange('idle');
  }

  // For demo: allow text input as well
  async sendTextMessage(text: string) {
    this.callbacks?.onStateChange('processing');
    this.callbacks?.onTranscript(text, true);

    try {
      const response = await this.getAIResponse(text);
      this.callbacks?.onTranscript(response, false);
      await this.speakText(response);
    } catch (error) {
      console.error('Error sending text message:', error);
      this.callbacks?.onError('Failed to process message');
      this.callbacks?.onStateChange('idle');
    }
  }
}

export const voiceService = new VoiceService();
export type { VoiceState, VoiceServiceCallbacks };
