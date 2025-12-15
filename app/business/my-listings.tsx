import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import { ApprovalStatus } from "@/types";

type ListingType = "lodging" | "food" | "events" | "destinations";

interface Listing {
  id: string;
  name: string;
  type: ListingType;
  status: ApprovalStatus;
  image?: string;
  created_at: string;
}

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "#D97706",
  approved: "#059669",
  rejected: "#DC2626",
};

export default function MyListingsScreen() {
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    if (!user?.id) return;

    try {
      // Fetch from all tables
      const [lodgingRes, foodRes, eventsRes, destinationsRes] = await Promise.all([
        supabase
          .from("lodging")
          .select("id, name, name_ar, status, images, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("food")
          .select("id, name, name_ar, status, images, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("events")
          .select("id, title, title_ar, status, images, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("destinations")
          .select("id, name, name_ar, status, images, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const allListings: Listing[] = [
        ...(lodgingRes.data || []).map((item) => ({
          id: item.id,
          name: language === "ar" ? item.name_ar : item.name,
          type: "lodging" as ListingType,
          status: item.status as ApprovalStatus,
          image: item.images?.[0],
          created_at: item.created_at,
        })),
        ...(foodRes.data || []).map((item) => ({
          id: item.id,
          name: language === "ar" ? item.name_ar : item.name,
          type: "food" as ListingType,
          status: item.status as ApprovalStatus,
          image: item.images?.[0],
          created_at: item.created_at,
        })),
        ...(eventsRes.data || []).map((item) => ({
          id: item.id,
          name: language === "ar" ? item.title_ar : item.title,
          type: "events" as ListingType,
          status: item.status as ApprovalStatus,
          image: item.images?.[0],
          created_at: item.created_at,
        })),
        ...(destinationsRes.data || []).map((item) => ({
          id: item.id,
          name: language === "ar" ? item.name_ar : item.name,
          type: "destinations" as ListingType,
          status: item.status as ApprovalStatus,
          image: item.images?.[0],
          created_at: item.created_at,
        })),
      ];

      // Sort by created_at
      allListings.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setListings(allListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listing: Listing) => {
    Alert.alert(
      t("delete"),
      `Delete this ${listing.type}?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const table = listing.type === "events" ? "events" : listing.type;
              const { error } = await supabase
                .from(table)
                .delete()
                .eq("id", listing.id);

              if (error) throw error;

              setListings(listings.filter((l) => l.id !== listing.id));
            } catch (error: any) {
              Alert.alert(t("error"), error.message);
            }
          },
        },
      ]
    );
  };

  const filteredListings =
    filter === "all"
      ? listings
      : listings.filter((l) => l.status === filter);

  const getTypeLabel = (type: ListingType) => {
    switch (type) {
      case "lodging":
        return t("lodging");
      case "food":
        return t("food");
      case "events":
        return t("events");
      case "destinations":
        return t("featuredDestinations");
      default:
        return type;
    }
  };

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

        {/* Content */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0D7A5F"
            style={styles.loader}
          />
        ) : filteredListings.length === 0 ? (
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.emptyContainer}
          >
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t("noResults")}
            </Text>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            {filteredListings.map((listing, index) => (
              <Pressable
                key={`${listing.type}-${listing.id}`}
                style={[styles.listingCard, isRTL && styles.listingCardRTL]}
              >
                {listing.image ? (
                  <Image
                    source={{ uri: listing.image }}
                    style={styles.listingImage}
                  />
                ) : (
                  <View style={[styles.listingImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}

                <View style={styles.listingInfo}>
                  <Text
                    style={[styles.listingName, isRTL && styles.textRTL]}
                    numberOfLines={1}
                  >
                    {listing.name}
                  </Text>
                  <Text style={[styles.listingType, isRTL && styles.textRTL]}>
                    {getTypeLabel(listing.type)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${STATUS_COLORS[listing.status]}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: STATUS_COLORS[listing.status] },
                      ]}
                    >
                      {t(`status${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}` as any)}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(listing)}
                >
                  <Text style={styles.deleteText}>X</Text>
                </Pressable>
              </Pressable>
            ))}
          </Animated.View>
        )}

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
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#737373",
  },
  listingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listingCardRTL: {
    flexDirection: "row-reverse",
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#737373",
  },
  listingInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  listingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  listingType: {
    fontSize: 13,
    color: "#737373",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 32,
  },
});
