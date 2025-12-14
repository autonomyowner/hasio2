import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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

export function VoiceAssistant({
  isRTL,
  translations,
}: VoiceAssistantProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const buttonScale = useSharedValue(1);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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
            {/* Placeholder Circle */}
            <View style={styles.voiceCircleContainer}>
              <View style={styles.voiceCircle}>
                <View style={styles.largeMicIcon}>
                  <View style={styles.largeMicHead} />
                  <View style={styles.largeMicStand} />
                  <View style={styles.largeMicBase} />
                </View>
              </View>
            </View>

            {/* Coming Soon Text */}
            <Text style={[styles.statusText, isRTL && styles.textRTL]}>
              Coming Soon
            </Text>
            <Text style={[styles.descriptionText, isRTL && styles.textRTL]}>
              Voice assistant will be available in a future update
            </Text>
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
  voiceCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8E5E0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  largeMicIcon: {
    alignItems: "center",
  },
  largeMicHead: {
    width: 36,
    height: 52,
    backgroundColor: "#A3A3A3",
    borderRadius: 18,
  },
  largeMicStand: {
    width: 4,
    height: 16,
    backgroundColor: "#A3A3A3",
    marginTop: 4,
  },
  largeMicBase: {
    width: 44,
    height: 6,
    backgroundColor: "#A3A3A3",
    borderRadius: 3,
    marginTop: 2,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 32,
  },
  descriptionText: {
    fontSize: 15,
    color: "#737373",
    marginTop: 12,
    textAlign: "center",
  },
});
