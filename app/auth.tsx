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
import { UserType } from "@/types";

type AuthMode = "login" | "signup";
type SignupStep = "credentials" | "userType";

// User type options configuration
const USER_TYPE_OPTIONS: { type: UserType; labelKey: string; descKey: string }[] = [
  { type: "user", labelKey: "userTypeUser", descKey: "userTypeUserDesc" },
  { type: "business", labelKey: "userTypeBusiness", descKey: "userTypeBusinessDesc" },
  { type: "provider", labelKey: "userTypeProvider", descKey: "userTypeProviderDesc" },
];

export default function AuthScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

  const [mode, setMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserType>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsNext = () => {
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

    // Move to user type selection
    setSignupStep("userType");
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation for login
    if (mode === "login") {
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
          fullName.trim() || undefined,
          userType
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
    setSignupStep("credentials");
    setUserType("user");
    setError(null);
  };

  const handleBackToCredentials = () => {
    setSignupStep("credentials");
    setError(null);
  };

  // Render user type selection step
  const renderUserTypeSelection = () => (
    <>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={[styles.header, isRTL && styles.headerRTL]}
      >
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t("selectAccountType")}
        </Text>
        <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
          {t("accountTypeDescription")}
        </Text>
      </Animated.View>

      {/* User Type Options */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.form}
      >
        {USER_TYPE_OPTIONS.map((option, index) => (
          <Pressable
            key={option.type}
            onPress={() => setUserType(option.type)}
            style={[
              styles.userTypeCard,
              userType === option.type && styles.userTypeCardSelected,
            ]}
          >
            <View style={styles.userTypeContent}>
              <Text
                style={[
                  styles.userTypeLabel,
                  userType === option.type && styles.userTypeLabelSelected,
                  isRTL && styles.textRTL,
                ]}
              >
                {t(option.labelKey as any)}
              </Text>
              <Text
                style={[
                  styles.userTypeDesc,
                  isRTL && styles.textRTL,
                ]}
              >
                {t(option.descKey as any)}
              </Text>
            </View>
            <View
              style={[
                styles.userTypeRadio,
                userType === option.type && styles.userTypeRadioSelected,
              ]}
            >
              {userType === option.type && <View style={styles.userTypeRadioInner} />}
            </View>
          </Pressable>
        ))}

        {error && (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <Button
          title={isLoading ? "" : t("signUp")}
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

        {/* Back to credentials */}
        <Pressable onPress={handleBackToCredentials} style={styles.backButton}>
          <Text style={styles.backText}>{t("back")}</Text>
        </Pressable>
      </Animated.View>
    </>
  );

  // Render credentials form
  const renderCredentialsForm = () => (
    <>
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
          title={isLoading ? "" : mode === "login" ? t("signIn") : t("continue")}
          onPress={mode === "login" ? handleSubmit : handleCredentialsNext}
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
    </>
  );

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
          {mode === "signup" && signupStep === "userType"
            ? renderUserTypeSelection()
            : renderCredentialsForm()}
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
  // User Type Selection Styles
  userTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  userTypeCardSelected: {
    borderColor: "#0D7A5F",
    backgroundColor: "#F0FDF9",
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  userTypeLabelSelected: {
    color: "#0D7A5F",
  },
  userTypeDesc: {
    fontSize: 14,
    color: "#737373",
    lineHeight: 20,
  },
  userTypeRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D4D4D4",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  userTypeRadioSelected: {
    borderColor: "#0D7A5F",
  },
  userTypeRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0D7A5F",
  },
});
