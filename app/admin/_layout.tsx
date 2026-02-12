import { Stack } from "expo-router";
import { useConvexUser } from "@/hooks/useConvexUser";
import { Redirect } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function AdminLayout() {
  const { isLoaded, isSignedIn, isAdmin, isUserLoading } = useConvexUser();

  // Show loading while checking auth
  if (!isLoaded || isUserLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D7A5F" />
      </View>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Redirect href="/auth" />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FAF7F2" },
      }}
    >
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF7F2",
  },
});
