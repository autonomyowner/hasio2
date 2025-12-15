import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui";

interface AuthPromptProps {
  onContinueAsGuest?: () => void;
}

export function AuthPrompt({ onContinueAsGuest }: AuthPromptProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const handleSignIn = () => {
    router.push("/onboarding");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(500)}
        style={[styles.content, isRTL && styles.contentRTL]}
      >
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t("signInRequired")}
        </Text>
        <Text style={[styles.message, isRTL && styles.textRTL]}>
          {t("signInRequiredMessage")}
        </Text>

        <Button
          title={t("signIn")}
          onPress={handleSignIn}
          fullWidth
          style={styles.signInButton}
        />

        {onContinueAsGuest && (
          <Pressable onPress={onContinueAsGuest} style={styles.guestButton}>
            <Text style={styles.guestText}>{t("continueAsGuest")}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FAF7F2",
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  contentRTL: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#737373",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  textRTL: {
    textAlign: "center",
  },
  signInButton: {
    marginBottom: 16,
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  guestText: {
    fontSize: 15,
    color: "#737373",
    fontWeight: "500",
  },
});
