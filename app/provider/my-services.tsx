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
import { ApprovalStatus, ServiceType } from "@/types";

interface ServiceItem {
  id: string;
  title: string;
  service_type: ServiceType;
  status: ApprovalStatus;
  image?: string;
  created_at: string;
}

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "#D97706",
  approved: "#059669",
  rejected: "#DC2626",
};

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  tour_guide: "tourGuide",
  photographer: "photographer",
  driver: "driver",
  translator: "translator",
  event_planner: "eventPlanner",
  catering: "catering",
  equipment_rental: "equipmentRental",
  other: "otherService",
};

export default function MyServicesScreen() {
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("all");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, title_ar, service_type, status, images, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedServices: ServiceItem[] = (data || []).map((item) => ({
        id: item.id,
        title: language === "ar" ? item.title_ar : item.title,
        service_type: item.service_type as ServiceType,
        status: item.status as ApprovalStatus,
        image: item.images?.[0],
        created_at: item.created_at,
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (service: ServiceItem) => {
    Alert.alert(
      t("delete"),
      `Delete this service?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("services")
                .delete()
                .eq("id", service.id);

              if (error) throw error;

              setServices(services.filter((s) => s.id !== service.id));
            } catch (error: any) {
              Alert.alert(t("error"), error.message);
            }
          },
        },
      ]
    );
  };

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((s) => s.status === filter);

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
            {t("myServices")}
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
        ) : filteredServices.length === 0 ? (
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
            {filteredServices.map((service) => (
              <Pressable
                key={service.id}
                style={[styles.serviceCard, isRTL && styles.serviceCardRTL]}
              >
                {service.image ? (
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                  />
                ) : (
                  <View style={[styles.serviceImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}

                <View style={styles.serviceInfo}>
                  <Text
                    style={[styles.serviceName, isRTL && styles.textRTL]}
                    numberOfLines={1}
                  >
                    {service.title}
                  </Text>
                  <Text style={[styles.serviceType, isRTL && styles.textRTL]}>
                    {t(SERVICE_TYPE_LABELS[service.service_type] as any)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${STATUS_COLORS[service.status]}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: STATUS_COLORS[service.status] },
                      ]}
                    >
                      {t(`status${service.status.charAt(0).toUpperCase() + service.status.slice(1)}` as any)}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(service)}
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
  serviceCard: {
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
  serviceCardRTL: {
    flexDirection: "row-reverse",
  },
  serviceImage: {
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
  serviceInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  serviceType: {
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
