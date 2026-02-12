import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { authClient } from "@/lib/authClient";
import { useAppStore } from "@/stores/appStore";

export default function Index() {
  const router = useRouter();
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding
  );
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Wait for session to load
    if (isPending) return;

    // Small delay for smooth transition
    const timer = setTimeout(() => {
      // If signed in or completed onboarding, go to main app
      if (session || hasCompletedOnboarding) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isPending, session, hasCompletedOnboarding]);

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
