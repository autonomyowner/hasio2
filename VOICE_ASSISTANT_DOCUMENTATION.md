# Voice Assistant - Technical Documentation

A complete guide to implementing a voice-powered AI assistant in React Native/Expo applications.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                           │
│                    (Hold button to speak)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VOICE RECORDING                             │
│                      (expo-av)                                  │
│              Records audio → .m4a file                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SPEECH-TO-TEXT (STT)                            │
│         Groq Whisper API (primary)                              │
│         OpenAI Whisper API (fallback)                           │
│              Audio → Text transcript                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI CHAT MODEL                                │
│         Groq LLaMA 3.3 70B (primary)                            │
│         OpenAI GPT-4o-mini (fallback)                           │
│              User text → AI response                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 TEXT-TO-SPEECH (TTS)                            │
│         ElevenLabs API (primary)                                │
│         Device TTS via expo-speech (fallback)                   │
│              AI text → Audio playback                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Voice States

The assistant operates in 5 distinct states:

| State | Description | UI Behavior |
|-------|-------------|-------------|
| `idle` | Ready for input | Static button, "Hold to speak" hint |
| `connecting` | Initializing connection | Yellow indicator |
| `listening` | Recording user voice | Red button, pulsing animation |
| `processing` | Transcribing + generating AI response | Purple button, slow pulse |
| `speaking` | Playing AI audio response | Green button, wave animation |

```typescript
type VoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';
```

---

## Required Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-av": "~15.1.4",
    "expo-speech": "~13.1.3",
    "expo-file-system": "~18.1.10",
    "react-native-reanimated": "~3.17.4"
  }
}
```

Install with:
```bash
npx expo install expo-av expo-speech expo-file-system react-native-reanimated
```

---

## API Configuration

### Environment Variables (.env)

```env
EXPO_PUBLIC_GROQ_API_KEY=gsk_your_groq_key_here
EXPO_PUBLIC_OPENAI_API_KEY=sk-your_openai_key_here
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

### Config File (lib/elevenlabs.ts)

```typescript
export const ELEVENLABS_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || "",
  agentId: "your_agent_id", // Optional: for conversational AI
};

export const AI_CONFIG = {
  provider: 'groq' as 'groq' | 'openai',
  groqApiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY || '',
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
};
```

---

## Core Service Implementation

### File: `lib/voiceService.ts`

```typescript
import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system/next';
import * as Speech from 'expo-speech';
import { ELEVENLABS_CONFIG, AI_CONFIG } from './elevenlabs';

type VoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

interface VoiceServiceCallbacks {
  onStateChange: (state: VoiceState) => void;
  onTranscript: (text: string, isUser: boolean) => void;
  onError: (error: string) => void;
}

// ElevenLabs voice ID - Sarah (friendly female voice)
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

class VoiceService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private callbacks: VoiceServiceCallbacks | null = null;
  private conversationHistory: { role: string; content: string }[] = [];

  // ═══════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════

  async initialize(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
    this.conversationHistory = [];

    // Request microphone permission
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      callbacks.onError('Microphone permission denied');
      return false;
    }

    // Configure audio mode for recording + playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return true;
  }

  // ═══════════════════════════════════════════════════════════
  // VOICE RECORDING
  // ═══════════════════════════════════════════════════════════

  async startListening() {
    this.callbacks?.onStateChange('listening');

    try {
      // Clean up any existing recording
      if (this.recording) {
        try {
          const status = await this.recording.getStatusAsync();
          if (status.isRecording) {
            await this.recording.stopAndUnloadAsync();
          }
        } catch (e) {
          console.log('Cleanup of previous recording:', e);
        }
        this.recording = null;
      }

      // Create and start new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.recording = null;
      this.callbacks?.onError('Failed to start microphone');
      this.callbacks?.onStateChange('idle');
    }
  }

  async stopListening() {
    if (!this.recording) return;

    this.callbacks?.onStateChange('processing');

    try {
      const status = await this.recording.getStatusAsync();

      if (!status.isRecording && !status.isDoneRecording) {
        this.recording = null;
        this.callbacks?.onStateChange('idle');
        return;
      }

      const uri = this.recording.getURI();

      if (status.isRecording) {
        await this.recording.stopAndUnloadAsync();
      }

      this.recording = null;

      if (uri) {
        await this.processAudio(uri);
      } else {
        this.callbacks?.onStateChange('idle');
      }

    } catch (error: any) {
      this.recording = null;

      if (error?.message?.includes('Recorder does not exist')) {
        this.callbacks?.onStateChange('idle');
        return;
      }

      this.callbacks?.onError('Recording failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // AUDIO PROCESSING PIPELINE
  // ═══════════════════════════════════════════════════════════

  private async processAudio(uri: string) {
    try {
      // Step 1: Transcribe audio to text
      const userMessage = await this.transcribeAudio(uri);

      if (!userMessage || userMessage.trim().length === 0) {
        this.callbacks?.onError('No speech detected');
        this.callbacks?.onStateChange('idle');
        return;
      }

      // Show user's transcript
      this.callbacks?.onTranscript(userMessage, true);

      // Step 2: Get AI response
      const aiResponse = await this.getAIResponse(userMessage);

      // Show AI's response
      this.callbacks?.onTranscript(aiResponse, false);

      // Step 3: Convert response to speech
      await this.speakText(aiResponse);

    } catch (error) {
      console.error('Error processing audio:', error);
      this.callbacks?.onError('Processing failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SPEECH-TO-TEXT (Whisper API)
  // ═══════════════════════════════════════════════════════════

  private async transcribeAudio(uri: string): Promise<string> {
    const hasGroqKey = AI_CONFIG.groqApiKey && AI_CONFIG.groqApiKey.length > 10;
    const hasOpenAIKey = AI_CONFIG.openaiApiKey && AI_CONFIG.openaiApiKey.length > 10;

    if (!hasGroqKey && !hasOpenAIKey) {
      throw new Error('No API key configured for speech-to-text');
    }

    // Build form data with audio file
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    } as any);

    let response: Response;

    if (hasGroqKey) {
      // Use Groq Whisper (faster, free tier)
      formData.append('model', 'whisper-large-v3');
      response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.groqApiKey}`,
        },
        body: formData,
      });
    } else {
      // Use OpenAI Whisper
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
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  }

  // ═══════════════════════════════════════════════════════════
  // AI CHAT COMPLETION
  // ═══════════════════════════════════════════════════════════

  private async getAIResponse(userMessage: string): Promise<string> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    // Define your assistant's personality
    const systemPrompt = `You are a helpful AI assistant. Be concise (2-3 sentences max), helpful, and friendly. Always be specific and actionable in your responses.`;

    const hasGroqKey = AI_CONFIG.groqApiKey && AI_CONFIG.groqApiKey.length > 10;
    const hasOpenAIKey = AI_CONFIG.openaiApiKey && AI_CONFIG.openaiApiKey.length > 10;

    if (!hasGroqKey && !hasOpenAIKey) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      let response: Response;

      if (hasGroqKey) {
        // Use Groq API (faster, free tier)
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
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);

      // Add AI response to history
      this.conversationHistory.push({ role: 'assistant', content: aiMessage });

      return aiMessage;

    } catch (error) {
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Add your fallback responses based on keywords
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your AI assistant. How can I help you today?";
    }

    return "I'm here to help! What would you like to know?";
  }

  // ═══════════════════════════════════════════════════════════
  // TEXT-TO-SPEECH (ElevenLabs)
  // ═══════════════════════════════════════════════════════════

  private async speakText(text: string) {
    this.callbacks?.onStateChange('speaking');

    try {
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
        throw new Error(`TTS failed: ${response.status}`);
      }

      // Convert response to base64 and save as temp file
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const base64Audio = this.uint8ArrayToBase64(bytes);

      // Save to temp file
      const audioPath = Paths.cache.uri + `tts_${Date.now()}.mp3`;
      const audioFile = new File(audioPath);
      await audioFile.write(base64Audio, { encoding: 'base64' });

      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Play the audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true, volume: 1.0 }
      );

      this.sound = sound;

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.callbacks?.onStateChange('idle');
          // Clean up temp file
          try {
            await audioFile.delete();
          } catch (e) {}
        }
      });

    } catch (error) {
      console.error('ElevenLabs TTS failed, using device TTS:', error);
      await this.speakWithDeviceTTS(text);
    }
  }

  // Base64 encoder (React Native compatible)
  private uint8ArrayToBase64(bytes: Uint8Array): string {
    const CHUNK_SIZE = 0x8000; // 32KB chunks
    const chunks: string[] = [];

    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, i + CHUNK_SIZE);
      chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
    }

    const binary = chunks.join('');
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    while (i < binary.length) {
      const a = binary.charCodeAt(i++);
      const b = i < binary.length ? binary.charCodeAt(i++) : 0;
      const c = i < binary.length ? binary.charCodeAt(i++) : 0;

      const triplet = (a << 16) | (b << 8) | c;

      result += base64Chars[(triplet >> 18) & 0x3F];
      result += base64Chars[(triplet >> 12) & 0x3F];
      result += i > binary.length + 1 ? '=' : base64Chars[(triplet >> 6) & 0x3F];
      result += i > binary.length ? '=' : base64Chars[triplet & 0x3F];
    }

    return result;
  }

  // Fallback: Device native TTS
  private async speakWithDeviceTTS(text: string) {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          this.callbacks?.onStateChange('idle');
        },
        onError: () => {
          this.callbacks?.onError('Speech failed');
          this.callbacks?.onStateChange('idle');
        },
      });
    } catch (error) {
      this.callbacks?.onError('Speech failed');
      this.callbacks?.onStateChange('idle');
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CLEANUP & TEXT INPUT
  // ═══════════════════════════════════════════════════════════

  async disconnect() {
    Speech.stop();

    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {}
    }

    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      } catch (error) {}
    }

    this.conversationHistory = [];
    this.callbacks?.onStateChange('idle');
  }

  // Allow text input as alternative to voice
  async sendTextMessage(text: string) {
    this.callbacks?.onStateChange('processing');
    this.callbacks?.onTranscript(text, true);

    try {
      const response = await this.getAIResponse(text);
      this.callbacks?.onTranscript(response, false);
      await this.speakText(response);
    } catch (error) {
      this.callbacks?.onError('Failed to process message');
      this.callbacks?.onStateChange('idle');
    }
  }
}

export const voiceService = new VoiceService();
export type { VoiceState, VoiceServiceCallbacks };
```

---

## UI Component Implementation

### File: `components/VoiceAssistant.tsx`

```typescript
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { voiceService, VoiceState } from "../lib/voiceService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function VoiceAssistant() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [textInput, setTextInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const buttonScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);
  const waveScale1 = useSharedValue(1);
  const waveScale2 = useSharedValue(1);
  const waveScale3 = useSharedValue(1);

  // Initialize voice service when modal opens
  useEffect(() => {
    if (isModalVisible) {
      voiceService.initialize({
        onStateChange: setVoiceState,
        onTranscript: (text, isUser) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text,
              isUser,
              timestamp: new Date(),
            },
          ]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
        onError: (err) => {
          setError(err);
          setTimeout(() => setError(null), 3000);
        },
      });
    }

    return () => {
      if (!isModalVisible) {
        voiceService.disconnect();
      }
    };
  }, [isModalVisible]);

  // Animate based on voice state
  useEffect(() => {
    if (voiceState === "listening") {
      // Pulsing animation for listening
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 800 }),
          withTiming(0.6, { duration: 800 })
        ),
        -1,
        true
      );
    } else if (voiceState === "speaking") {
      // Wave animation for speaking
      waveScale1.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
      waveScale2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(1.6, { duration: 500 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
      waveScale3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(1.8, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else if (voiceState === "processing") {
      // Slow pulse for processing
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
      pulseOpacity.value = 0.4;
    } else {
      // Reset all animations
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
      cancelAnimation(waveScale1);
      cancelAnimation(waveScale2);
      cancelAnimation(waveScale3);
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0.5);
      waveScale1.value = withTiming(1);
      waveScale2.value = withTiming(1);
      waveScale3.value = withTiming(1);
    }
  }, [voiceState]);

  // Hold-to-talk handlers
  const handlePressIn = async () => {
    if (voiceState === "speaking" || voiceState === "processing") return;
    setIsHolding(true);
    await voiceService.startListening();
  };

  const handlePressOut = async () => {
    if (isHolding) {
      setIsHolding(false);
      await voiceService.stopListening();
    }
  };

  const handleSendText = async () => {
    if (!textInput.trim() || voiceState !== "idle") return;
    const message = textInput.trim();
    setTextInput("");
    await voiceService.sendTextMessage(message);
  };

  // Get button color based on state
  const getCircleColor = () => {
    switch (voiceState) {
      case "connecting": return "#F59E0B"; // Yellow
      case "listening": return "#EF4444";   // Red
      case "processing": return "#6366F1";  // Purple
      case "speaking": return "#0D7A5F";    // Green
      default: return "#0D7A5F";            // Green
    }
  };

  // Animated styles
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale1.value }],
    opacity: 0.3,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale2.value }],
    opacity: 0.2,
  }));

  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale3.value }],
    opacity: 0.1,
  }));

  return (
    <>
      {/* Floating Button to Open Assistant */}
      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          setIsModalVisible(true);
          setMessages([]);
        }}
      >
        <View style={styles.micIcon}>
          <View style={styles.micHead} />
          <View style={styles.micStand} />
          <View style={styles.micBase} />
        </View>
      </Pressable>

      {/* Voice Assistant Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          voiceService.disconnect();
          setIsModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Voice Assistant</Text>
            <Pressable
              onPress={() => {
                voiceService.disconnect();
                setIsModalVisible(false);
              }}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Hold the button below and speak
                </Text>
              </View>
            )}
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  msg.isUser ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.isUser ? styles.userText : styles.aiText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Voice Button with Animations */}
          <View style={styles.voiceContainer}>
            {/* Wave animations (speaking state) */}
            {voiceState === "speaking" && (
              <>
                <Animated.View
                  style={[styles.wave, { backgroundColor: getCircleColor() }, wave3Style]}
                />
                <Animated.View
                  style={[styles.wave, { backgroundColor: getCircleColor() }, wave2Style]}
                />
                <Animated.View
                  style={[styles.wave, { backgroundColor: getCircleColor() }, wave1Style]}
                />
              </>
            )}

            {/* Pulse animation (listening/processing) */}
            {(voiceState === "listening" || voiceState === "processing") && (
              <Animated.View
                style={[styles.pulse, { backgroundColor: getCircleColor() }, pulseAnimatedStyle]}
              />
            )}

            {/* Main Button */}
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={voiceState === "speaking" || voiceState === "processing"}
              style={[styles.voiceButton, { backgroundColor: getCircleColor() }]}
            >
              <View style={styles.largeMicIcon}>
                <View style={styles.largeMicHead} />
                <View style={styles.largeMicStand} />
                <View style={styles.largeMicBase} />
              </View>
            </Pressable>
          </View>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {voiceState === "listening" ? "Listening..." :
             voiceState === "processing" ? "Thinking..." :
             voiceState === "speaking" ? "Speaking..." : "Ready"}
          </Text>
          <Text style={styles.hintText}>
            {voiceState === "listening" ? "Release to send" :
             voiceState === "idle" ? "Hold to speak" : "Please wait..."}
          </Text>

          {/* Text Input Alternative */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Or type a message..."
              value={textInput}
              onChangeText={setTextInput}
              onSubmitEditing={handleSendText}
              editable={voiceState === "idle"}
            />
            <Pressable
              onPress={handleSendText}
              disabled={voiceState !== "idle" || !textInput.trim()}
              style={[
                styles.sendButton,
                (voiceState !== "idle" || !textInput.trim()) && styles.sendDisabled,
              ]}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0D7A5F",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micIcon: { alignItems: "center" },
  micHead: {
    width: 14,
    height: 20,
    backgroundColor: "#FFF",
    borderRadius: 7,
  },
  micStand: {
    width: 2,
    height: 6,
    backgroundColor: "#FFF",
    marginTop: 2,
  },
  micBase: {
    width: 16,
    height: 3,
    backgroundColor: "#FFF",
    borderRadius: 1.5,
    marginTop: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E5E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeText: {
    fontSize: 16,
    color: "#0D7A5F",
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#737373",
    fontSize: 16,
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: "#0D7A5F",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: { color: "#FFF" },
  aiText: { color: "#1A1A1A" },
  voiceContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  pulse: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  wave: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  largeMicIcon: { alignItems: "center" },
  largeMicHead: {
    width: 28,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 14,
  },
  largeMicStand: {
    width: 3,
    height: 12,
    backgroundColor: "#FFF",
    marginTop: 3,
  },
  largeMicBase: {
    width: 32,
    height: 4,
    backgroundColor: "#FFF",
    borderRadius: 2,
    marginTop: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#0D7A5F",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sendDisabled: {
    backgroundColor: "#A3A3A3",
  },
  sendText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

---

## API Reference

### Speech-to-Text APIs

| Provider | Endpoint | Model | Speed | Cost |
|----------|----------|-------|-------|------|
| **Groq** | `api.groq.com/openai/v1/audio/transcriptions` | `whisper-large-v3` | Very Fast | Free tier |
| **OpenAI** | `api.openai.com/v1/audio/transcriptions` | `whisper-1` | Fast | $0.006/min |

### Chat Completion APIs

| Provider | Endpoint | Model | Speed | Cost |
|----------|----------|-------|-------|------|
| **Groq** | `api.groq.com/openai/v1/chat/completions` | `llama-3.3-70b-versatile` | Very Fast | Free tier |
| **OpenAI** | `api.openai.com/v1/chat/completions` | `gpt-4o-mini` | Fast | ~$0.15/1M tokens |

### Text-to-Speech APIs

| Provider | Endpoint | Model | Quality | Cost |
|----------|----------|-------|---------|------|
| **ElevenLabs** | `api.elevenlabs.io/v1/text-to-speech/{voice_id}` | `eleven_turbo_v2_5` | Excellent | ~$0.30/1K chars |
| **Device TTS** | `expo-speech` | Native | Good | Free |

### ElevenLabs Voice IDs

| Voice ID | Name | Description |
|----------|------|-------------|
| `EXAVITQu4vr4xnSDxMaL` | Sarah | Friendly female voice |
| `21m00Tcm4TlvDq8ikWAM` | Rachel | Calm female voice |
| `AZnzlk1XvdvUeBnXmlld` | Domi | Strong female voice |
| `CYw3kZ02Hs0563khs1Fj` | Dave | Conversational male |
| `D38z5RcWu1voky8WS1ja` | Fin | Irish male voice |

---

## App Permissions

### iOS (app.json)

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "This app needs microphone access for voice commands"
      }
    }
  }
}
```

### Android (app.json)

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

---

## Usage in Your App

```typescript
import { VoiceAssistant } from './components/VoiceAssistant';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}

      {/* Voice Assistant (floating button + modal) */}
      <VoiceAssistant />
    </View>
  );
}
```

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Recording | expo-av | Capture user voice |
| STT | Groq/OpenAI Whisper | Convert audio to text |
| AI | Groq LLaMA / OpenAI GPT | Generate responses |
| TTS | ElevenLabs / expo-speech | Convert text to audio |
| Animations | react-native-reanimated | Smooth UI feedback |
| State | React useState | Manage voice states |

**Flow**: Hold button → Record → Transcribe → AI Response → Speak → Release
