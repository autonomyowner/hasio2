import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ServiceStats {
  total: number;
  pending: number;
  approved: number;
}

export default function ProviderDashboardContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    pending: 0,
    approved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("services")
        .select("status")
        .eq("owner_id", user.id);

      if (error) throw error;

      const total = data?.length || 0;
      const pending = data?.filter((item) => item.status === "pending").length || 0;
      const approved = data?.filter((item) => item.status === "approved").length || 0;

      setStats({ total, pending, approved });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={[styles.header, isRTL && styles.headerRTL]}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{t("back")}</Text>
          </Pressable>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("providerDashboard")}
          </Text>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.statsContainer}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0D7A5F" />
          ) : (
            <View style={[styles.statsRow, isRTL && styles.statsRowRTL]}>
              <StatCard
                label={t("myServices")}
                value={stats.total}
                color="#0D7A5F"
                isRTL={isRTL}
              />
              <StatCard
                label={t("pendingApproval")}
                value={stats.pending}
                color="#D97706"
                isRTL={isRTL}
              />
              <StatCard
                label={t("activeServices")}
                value={stats.approved}
                color="#059669"
                isRTL={isRTL}
              />
            </View>
          )}
        </Animated.View>

        {/* First listing note */}
        {stats.total === 0 && !isLoading && (
          <Animated.View
            entering={FadeInDown.delay(250).duration(600)}
            style={styles.noteContainer}
          >
            <Text style={[styles.noteText, isRTL && styles.textRTL]}>
              {t("firstListingNote")}
            </Text>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <ActionButton
            label={t("postService")}
            onPress={() => router.push("/provider/post-service")}
            isRTL={isRTL}
            primary
          />

          <ActionButton
            label={t("myServices")}
            onPress={() => router.push("/provider/my-services")}
            isRTL={isRTL}
          />
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  isRTL: boolean;
}

function StatCard({ label, value, color, isRTL }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, isRTL && styles.textRTL]}>{label}</Text>
    </View>
  );
}

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  isRTL: boolean;
  primary?: boolean;
}

function ActionButton({ label, onPress, isRTL, primary }: ActionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      style={[
        styles.actionButton,
        primary && styles.actionButtonPrimary,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          styles.actionButtonText,
          primary && styles.actionButtonTextPrimary,
          isRTL && styles.textRTL,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRTL: {
    alignItems: "flex-end",
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 15,
    color: "#0D7A5F",
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  textRTL: {
    textAlign: "right",
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statsRowRTL: {
    flexDirection: "row-reverse",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#737373",
    textAlign: "center",
  },
  noteContainer: {
    marginHorizontal: 24,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
  },
  actionButton: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  actionButtonPrimary: {
    backgroundColor: "#0D7A5F",
    borderColor: "#0D7A5F",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  actionButtonTextPrimary: {
    color: "#FFFFFF",
  },
  bottomSpacing: {
    height: 32,
  },
});
