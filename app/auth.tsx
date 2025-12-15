import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useAppStore } from "@/stores/appStore";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    if (!password.trim()) {
      setError(t("passwordRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const { user, error: authError } = await signInWithEmail(email.trim(), password);
        if (authError) {
          setError(authError);
          return;
        }
        if (user) {
          setOnboardingComplete(true);
          router.replace("/(tabs)");
        }
      } else {
        const { user, error: authError } = await signUpWithEmail(
          email.trim(),
          password,
          fullName.trim() || undefined
        );
        if (authError) {
          setError(authError);
          return;
        }
        if (user) {
          setOnboardingComplete(true);
          router.replace("/(tabs)");
        }
      }
    } catch (err: any) {
      setError(err.message || t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            style={[styles.header, isRTL && styles.headerRTL]}
          >
            <Text style={[styles.title, isRTL && styles.textRTL]}>
              {mode === "login" ? t("welcomeBack") : t("createAccount")}
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
              {mode === "login" ? t("signInToContinue") : t("signUpToContinue")}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.form}
          >
            {mode === "signup" && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("fullName")}
                </Text>
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={t("fullNamePlaceholder")}
                  placeholderTextColor="#A3A3A3"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.textRTL]}>
                {t("email")}
              </Text>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t("emailPlaceholder")}
                placeholderTextColor="#A3A3A3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textAlign={isRTL ? "right" : "left"}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.textRTL]}>
                {t("password")}
              </Text>
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t("passwordPlaceholder")}
                placeholderTextColor="#A3A3A3"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign={isRTL ? "right" : "left"}
              />
            </View>

            {error && (
              <Animated.View entering={FadeInUp.duration(300)} style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <Button
              title={isLoading ? "" : mode === "login" ? t("signIn") : t("signUp")}
              onPress={handleSubmit}
              fullWidth
              disabled={isLoading}
              style={styles.submitButton}
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={styles.loadingIndicator}
              />
            )}

            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleText, isRTL && styles.textRTL]}>
                {mode === "login" ? t("noAccount") : t("haveAccount")}
              </Text>
              <Pressable onPress={toggleMode}>
                <Text style={styles.toggleLink}>
                  {mode === "login" ? t("signUp") : t("signIn")}
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{t("back")}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  headerRTL: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#737373",
    lineHeight: 24,
  },
  textRTL: {
    textAlign: "right",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  inputRTL: {
    textAlign: "right",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 8,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  toggleText: {
    fontSize: 15,
    color: "#737373",
  },
  toggleLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D7A5F",
  },
  backButton: {
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  backText: {
    fontSize: 15,
    color: "#737373",
    fontWeight: "500",
  },
});
