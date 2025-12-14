import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useConversation } from "@elevenlabs/react-native";
import { ELEVENLABS_CONFIG } from "@/lib/elevenlabs";

interface VoiceAssistantProps {
  isRTL: boolean;
  translations: {
    tapToSpeak: string;
    listening: string;
    thinking: string;
    speaking: string;
    connecting: string;
    tapToStop: string;
    voiceAssistant: string;
    close: string;
  };
  onTranscript?: (text: string, isUser: boolean) => void;
}

type ConversationStatus = "disconnected" | "connecting" | "connected" | "disconnecting";
type AgentMode = "listening" | "speaking" | null;

export function VoiceAssistant({
  isRTL,
  translations,
  onTranscript,
}: VoiceAssistantProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState<ConversationStatus>("disconnected");
  const [agentMode, setAgentMode] = useState<AgentMode>(null);

  // Animation values
  const pulseScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const waveOpacity1 = useSharedValue(0);
  const waveOpacity2 = useSharedValue(0);
  const waveOpacity3 = useSharedValue(0);
  const waveScale1 = useSharedValue(1);
  const waveScale2 = useSharedValue(1);
  const waveScale3 = useSharedValue(1);

  const conversation = useConversation({
    onConnect: () => {
      setStatus("connected");
      setAgentMode("listening");
      startListeningAnimation();
    },
    onDisconnect: () => {
      setStatus("disconnected");
      setAgentMode(null);
      stopAnimations();
    },
    onMessage: ({ message, source }) => {
      if (source === "user" && message) {
        onTranscript?.(message, true);
      } else if (source === "ai" && message) {
        onTranscript?.(message, false);
      }
    },
    onModeChange: ({ mode }) => {
      setAgentMode(mode as AgentMode);
      if (mode === "listening") {
        startListeningAnimation();
      } else if (mode === "speaking") {
        startSpeakingAnimation();
      } else {
        stopAnimations();
      }
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      setStatus("disconnected");
      setAgentMode(null);
    },
  });

  const startListeningAnimation = useCallback(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const startSpeakingAnimation = useCallback(() => {
    // Wave animations
    waveOpacity1.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1
    );
    waveScale1.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1200 }),
        withTiming(1, { duration: 0 })
      ),
      -1
    );

    setTimeout(() => {
      waveOpacity2.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1
      );
      waveScale2.value = withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1200 }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
    }, 300);

    setTimeout(() => {
      waveOpacity3.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1
      );
      waveScale3.value = withRepeat(
        withSequence(
          withTiming(2.1, { duration: 1200 }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
    }, 600);
  }, []);

  const stopAnimations = useCallback(() => {
    cancelAnimation(pulseScale);
    cancelAnimation(waveOpacity1);
    cancelAnimation(waveOpacity2);
    cancelAnimation(waveOpacity3);
    cancelAnimation(waveScale1);
    cancelAnimation(waveScale2);
    cancelAnimation(waveScale3);
    pulseScale.value = withTiming(1);
    waveOpacity1.value = withTiming(0);
    waveOpacity2.value = withTiming(0);
    waveOpacity3.value = withTiming(0);
    waveScale1.value = withTiming(1);
    waveScale2.value = withTiming(1);
    waveScale3.value = withTiming(1);
  }, []);

  const handleStartConversation = async () => {
    try {
      setStatus("connecting");
      await conversation.startSession({
        agentId: ELEVENLABS_CONFIG.agentId,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setStatus("disconnected");
    }
  };

  const handleStopConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
    setStatus("disconnected");
    setAgentMode(null);
    stopAnimations();
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = async () => {
    if (status === "connected" || status === "connecting") {
      await handleStopConversation();
    }
    setIsModalVisible(false);
    setStatus("disconnected");
  };

  const handleMainButtonPress = () => {
    if (status === "disconnected") {
      handleStartConversation();
    } else if (status === "connected") {
      handleStopConversation();
    }
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const wave1Style = useAnimatedStyle(() => ({
    opacity: waveOpacity1.value,
    transform: [{ scale: waveScale1.value }],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    opacity: waveOpacity2.value,
    transform: [{ scale: waveScale2.value }],
  }));

  const wave3Style = useAnimatedStyle(() => ({
    opacity: waveOpacity3.value,
    transform: [{ scale: waveScale3.value }],
  }));

  const getStatusText = () => {
    switch (status) {
      case "connecting":
        return translations.connecting;
      case "connected":
        if (agentMode === "listening") return translations.listening;
        if (agentMode === "speaking") return translations.speaking;
        return translations.tapToStop;
      case "disconnecting":
        return translations.connecting;
      default:
        return translations.tapToSpeak;
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <>
      {/* Floating Voice Button */}
      <Animated.View style={[styles.floatingButton, buttonAnimatedStyle]}>
        <Pressable
          style={styles.floatingButtonInner}
          onPress={handleOpenModal}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <View style={styles.micIconContainer}>
            <View style={styles.micIcon}>
              <View style={styles.micHead} />
              <View style={styles.micStand} />
              <View style={styles.micBase} />
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Voice Assistant Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.modalHeader, isRTL && styles.modalHeaderRTL]}>
            <Text style={[styles.modalTitle, isRTL && styles.textRTL]}>
              {translations.voiceAssistant}
            </Text>
            <Pressable onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{translations.close}</Text>
            </Pressable>
          </View>

          {/* Main Content */}
          <View style={styles.modalContent}>
            {/* Animated Voice Circle */}
            <View style={styles.voiceCircleContainer}>
              {/* Wave effects for speaking */}
              <Animated.View style={[styles.wave, wave3Style]} />
              <Animated.View style={[styles.wave, wave2Style]} />
              <Animated.View style={[styles.wave, wave1Style]} />

              {/* Main circle */}
              <Animated.View style={[styles.voiceCircle, pulseAnimatedStyle]}>
                <Pressable
                  style={styles.voiceCircleInner}
                  onPress={handleMainButtonPress}
                  disabled={status === "connecting"}
                >
                  {status === "connecting" ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <View style={styles.largeMicIcon}>
                      <View style={styles.largeMicHead} />
                      <View style={styles.largeMicStand} />
                      <View style={styles.largeMicBase} />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            </View>

            {/* Status Text */}
            <Text style={[styles.statusText, isRTL && styles.textRTL]}>
              {getStatusText()}
            </Text>

            {/* Mode Indicator */}
            {status === "connected" && agentMode && (
              <View style={styles.modeIndicator}>
                <View
                  style={[
                    styles.modeIndicatorDot,
                    agentMode === "listening" && styles.listeningDot,
                    agentMode === "speaking" && styles.speakingDot,
                  ]}
                />
                <Text style={styles.modeText}>
                  {agentMode === "listening" && translations.listening}
                  {agentMode === "speaking" && translations.speaking}
                </Text>
              </View>
            )}
          </View>
        </View>
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
    shadowColor: "#0D7A5F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  micIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  micIcon: {
    alignItems: "center",
  },
  micHead: {
    width: 14,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
  },
  micStand: {
    width: 2,
    height: 6,
    backgroundColor: "#FFFFFF",
    marginTop: 2,
  },
  micBase: {
    width: 16,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 1.5,
    marginTop: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E5E0",
  },
  modalHeaderRTL: {
    flexDirection: "row-reverse",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  textRTL: {
    textAlign: "right",
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#0D7A5F",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  voiceCircleContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#0D7A5F",
  },
  voiceCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#0D7A5F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0D7A5F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  voiceCircleInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  largeMicIcon: {
    alignItems: "center",
  },
  largeMicHead: {
    width: 36,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },
  largeMicStand: {
    width: 4,
    height: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
  },
  largeMicBase: {
    width: 44,
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    marginTop: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 32,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F1EB",
    borderRadius: 20,
  },
  modeIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  listeningDot: {
    backgroundColor: "#0D7A5F",
  },
  speakingDot: {
    backgroundColor: "#3B82F6",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#737373",
  },
});
