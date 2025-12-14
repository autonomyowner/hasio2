// ElevenLabs Conversational AI Configuration
export const ELEVENLABS_CONFIG = {
  apiKey: "sk_8a60c953856253ed965d26ecf875e04e2364903f362768ab",
  agentId: "agent_9701kcffp034epb9apq1astrvjbh",
};

// Helper to get signed URL for conversation (if needed for secure connections)
export async function getSignedUrl(): Promise<string> {
  // For client-side usage, we can connect directly with the agent ID
  // If you need server-side signed URLs, implement that endpoint here
  return `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_CONFIG.agentId}`;
}
