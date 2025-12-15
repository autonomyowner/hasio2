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

interface ListingStats {
  total: number;
  pending: number;
  approved: number;
}

export default function BusinessDashboardContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState<ListingStats>({
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
      // Fetch counts from all content tables
      const [lodgingRes, foodRes, eventsRes, destinationsRes] = await Promise.all([
        supabase.from("lodging").select("status", { count: "exact" }).eq("owner_id", user.id),
        supabase.from("food").select("status", { count: "exact" }).eq("owner_id", user.id),
        supabase.from("events").select("status", { count: "exact" }).eq("owner_id", user.id),
        supabase.from("destinations").select("status", { count: "exact" }).eq("owner_id", user.id),
      ]);

      const allItems = [
        ...(lodgingRes.data || []),
        ...(foodRes.data || []),
        ...(eventsRes.data || []),
        ...(destinationsRes.data || []),
      ];

      const total = allItems.length;
      const pending = allItems.filter((item) => item.status === "pending").length;
      const approved = allItems.filter((item) => item.status === "approved").length;

      setStats({ total, pending, approved });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { key: "postLodging", route: "/business/post-lodging" },
    { key: "postFood", route: "/business/post-food" },
    { key: "postEvent", route: "/business/post-event" },
    { key: "postDestination", route: "/business/post-destination" },
  ];

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
            {t("businessDashboard")}
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
                label={t("totalListings")}
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
                label={t("statusApproved")}
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

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("addImages")}
          </Text>

          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <ActionCard
                key={action.key}
                label={t(action.key as any)}
                onPress={() => router.push(action.route as any)}
                isRTL={isRTL}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* My Listings Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Pressable
            style={styles.listingsButton}
            onPress={() => router.push("/business/my-listings")}
          >
            <Text style={[styles.listingsButtonText, isRTL && styles.textRTL]}>
              {t("myListings")}
            </Text>
          </Pressable>
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

interface ActionCardProps {
  label: string;
  onPress: () => void;
  isRTL: boolean;
  delay: number;
}

function ActionCard({ label, onPress, isRTL, delay }: ActionCardProps) {
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
      style={[styles.actionCard, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={[styles.actionLabel, isRTL && styles.textRTL]}>{label}</Text>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitleRTL: {
    textAlign: "right",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  listingsButton: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#0D7A5F",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  listingsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacing: {
    height: 32,
  },
});
