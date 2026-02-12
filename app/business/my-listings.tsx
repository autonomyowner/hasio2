// My Listings - ready for Convex migration
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { ApprovalStatus } from "@/types";

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "#D97706",
  approved: "#059669",
  rejected: "#DC2626",
};

export default function MyListingsScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("all");

  // Empty listings - will be populated from Convex
  const listings: any[] = [];
  const filteredListings = filter === "all"
    ? listings
    : listings.filter((l) => l.status === filter);

  return (
    <SafeAreaView style={styles.container}>
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
            {t("myListings")}
          </Text>
        </Animated.View>

        {/* Filters */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.filterContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filterScroll,
              isRTL && styles.filterScrollRTL,
            ]}
          >
            {(["all", "pending", "approved", "rejected"] as const).map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === status && styles.filterTextActive,
                  ]}
                >
                  {status === "all" ? t("all") : t(`status${status.charAt(0).toUpperCase() + status.slice(1)}` as any)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Empty State */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.emptyContainer}
        >
          <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
            Backend features coming soon - migrating to Convex
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
  filterContainer: {
    paddingVertical: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterScrollRTL: {
    flexDirection: "row-reverse",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  filterButtonActive: {
    backgroundColor: "#0D7A5F",
    borderColor: "#0D7A5F",
  },
  filterText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#737373",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 32,
  },
});
