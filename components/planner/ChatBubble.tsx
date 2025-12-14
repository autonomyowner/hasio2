import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ChatMessage } from "@/types";

interface ChatBubbleProps {
  message: ChatMessage;
  isRTL: boolean;
}

export function ChatBubble({ message, isRTL }: ChatBubbleProps) {
  const isUser = message.isUser;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
        isRTL && (isUser ? styles.userContainerRTL : styles.botContainerRTL),
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.botText,
            isRTL && styles.textRTL,
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  userContainerRTL: {
    alignSelf: "flex-start",
  },
  botContainerRTL: {
    alignSelf: "flex-end",
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#0D7A5F",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  botText: {
    color: "#1A1A1A",
  },
  textRTL: {
    textAlign: "right",
  },
});
