import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/stores/appStore";
import { ChatBubble, VoiceAssistant } from "@/components/planner";
import type { ChatMessage } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PlannerScreenContentProps {
  onNavigateToTab?: (index: number) => void;
}

export function PlannerScreenContent({ onNavigateToTab }: PlannerScreenContentProps) {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);

  const chatMessages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);
    setInputText("");

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm here to help you plan your perfect day in Al-Ahsa. What would you like to know more about?",
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(botMessage);
    }, 1000);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const suggestionButtons = [
    { key: "lodging", label: t("suggestLodging"), tabIndex: 1 },
    { key: "food", label: t("suggestFood"), tabIndex: 2 },
    { key: "events", label: t("suggestEvents"), tabIndex: 3 },
    { key: "itinerary", label: t("suggestItinerary"), tabIndex: null },
  ];

  const handleSuggestion = (tabIndex: number | null, label: string) => {
    if (tabIndex !== null) {
      onNavigateToTab?.(tabIndex);
    } else {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: label,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(userMessage);

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I'd love to help you plan a full day itinerary! For a perfect day in Al-Ahsa, I recommend starting with breakfast at a traditional coffee house, then visiting the famous Jabal Al-Qara caves in the morning. Enjoy lunch at a local restaurant, and spend the afternoon exploring the date palm groves. End your day at the historic Al-Hofuf souq!",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        addChatMessage(botMessage);
      }, 1500);
    }
  };

  const handleVoiceTranscript = (text: string, isUser: boolean) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(message);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const voiceTranslations = {
    tapToSpeak: t("tapToSpeak"),
    listening: t("listening"),
    thinking: t("thinking"),
    speaking: t("speaking"),
    connecting: t("connecting"),
    tapToStop: t("tapToStop"),
    voiceAssistant: t("voiceAssistant"),
    close: t("close"),
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.inner, { paddingTop: insets.top }]}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={[styles.header, isRTL && styles.headerRTL]}
        >
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("plannerAssistant")}
          </Text>
        </Animated.View>

        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.welcomeContainer}
            >
              <View style={[styles.welcomeBubble, isRTL && styles.welcomeBubbleRTL]}>
                <Text style={[styles.welcomeTitle, isRTL && styles.textRTL]}>
                  {t("plannerWelcome")}
                </Text>
                <Text style={[styles.welcomeText, isRTL && styles.textRTL]}>
                  {t("plannerGreeting")}
                </Text>
              </View>

              <View style={[styles.suggestions, isRTL && styles.suggestionsRTL]}>
                {suggestionButtons.map((btn) => (
                  <SuggestionButton
                    key={btn.key}
                    label={btn.label}
                    onPress={() => handleSuggestion(btn.tabIndex, btn.label)}
                  />
                ))}
              </View>
            </Animated.View>
          )}

          {chatMessages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.delay(index * 50).duration(400)}
            >
              <ChatBubble message={message} isRTL={isRTL} />
            </Animated.View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL]}
            placeholder={t("chatPlaceholder")}
            placeholderTextColor="#A3A3A3"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            textAlign={isRTL ? "right" : "left"}
          />
          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>{t("sendMessage")}</Text>
          </Pressable>
        </View>

        {/* Voice Assistant */}
        <VoiceAssistant
          isRTL={isRTL}
          translations={voiceTranslations}
          onTranscript={handleVoiceTranscript}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

interface SuggestionButtonProps {
  label: string;
  onPress: () => void;
}

function SuggestionButton({ label, onPress }: SuggestionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      style={[styles.suggestionButton, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={styles.suggestionText}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E5E0",
    backgroundColor: "#FAF7F2",
  },
  headerRTL: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  textRTL: {
    textAlign: "right",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 24,
    paddingBottom: 16,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeBubbleRTL: {
    alignItems: "flex-end",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D7A5F",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1A1A1A",
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionsRTL: {
    flexDirection: "row-reverse",
  },
  suggestionButton: {
    backgroundColor: "#F5F1EB",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E5E0",
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E5E0",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F1EB",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1A1A",
    maxHeight: 100,
  },
  inputRTL: {
    writingDirection: "rtl",
  },
  sendButton: {
    backgroundColor: "#0D7A5F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#A3A3A3",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
