import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const router = useRouter();
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding
  );
  const { isInitialized, user } = useAuthStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) return;

    // Small delay for smooth transition
    const timer = setTimeout(() => {
      // If logged in or completed onboarding, go to main app
      if (user || hasCompletedOnboarding) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isInitialized, user, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0D7A5F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF7F2",
  },
});
