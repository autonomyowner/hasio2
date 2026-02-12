import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { Id } from "@/convex/_generated/dataModel";

type TabType = "overview" | "pending" | "reports";
type ContentType = "lodgings" | "foods" | "events" | "destinations" | "services";

export function AdminDashboardContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("lodgings");
  const [refreshing, setRefreshing] = useState(false);

  // Queries
  const stats = useQuery(api.admin.getDashboardStats);
  const pendingLodgings = useQuery(api.admin.getPendingLodgings);
  const pendingFoods = useQuery(api.admin.getPendingFoods);
  const pendingEvents = useQuery(api.admin.getPendingEvents);
  const pendingDestinations = useQuery(api.admin.getPendingDestinations);
  const pendingServices = useQuery(api.admin.getPendingServices);
  const unreviewedReports = useQuery(api.admin.getUnreviewedReports);

  // Mutations
  const updateLodgingStatus = useMutation(api.lodgings.updateStatus);
  const updateFoodStatus = useMutation(api.foods.updateStatus);
  const updateEventStatus = useMutation(api.events.updateStatus);
  const updateDestinationStatus = useMutation(api.destinations.updateStatus);
  const updateServiceStatus = useMutation(api.services.updateStatus);
  const markReportReviewed = useMutation(api.admin.markReportReviewed);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleApprove = async (type: ContentType, id: string) => {
    try {
      switch (type) {
        case "lodgings":
          await updateLodgingStatus({ id: id as Id<"lodgings">, status: "approved" });
          break;
        case "foods":
          await updateFoodStatus({ id: id as Id<"foods">, status: "approved" });
          break;
        case "events":
          await updateEventStatus({ id: id as Id<"events">, status: "approved" });
          break;
        case "destinations":
          await updateDestinationStatus({ id: id as Id<"destinations">, status: "approved" });
          break;
        case "services":
          await updateServiceStatus({ id: id as Id<"services">, status: "approved" });
          break;
      }
      Alert.alert(isRTL ? "تم" : "Success", isRTL ? "تمت الموافقة على المحتوى" : "Content approved");
    } catch (error: any) {
      Alert.alert(isRTL ? "خطأ" : "Error", error.message);
    }
  };

  const handleReject = async (type: ContentType, id: string) => {
    Alert.alert(
      isRTL ? "رفض المحتوى" : "Reject Content",
      isRTL ? "هل أنت متأكد من رفض هذا المحتوى؟" : "Are you sure you want to reject this content?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "رفض" : "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              switch (type) {
                case "lodgings":
                  await updateLodgingStatus({ id: id as Id<"lodgings">, status: "rejected" });
                  break;
                case "foods":
                  await updateFoodStatus({ id: id as Id<"foods">, status: "rejected" });
                  break;
                case "events":
                  await updateEventStatus({ id: id as Id<"events">, status: "rejected" });
                  break;
                case "destinations":
                  await updateDestinationStatus({ id: id as Id<"destinations">, status: "rejected" });
                  break;
                case "services":
                  await updateServiceStatus({ id: id as Id<"services">, status: "rejected" });
                  break;
              }
              Alert.alert(isRTL ? "تم" : "Success", isRTL ? "تم رفض المحتوى" : "Content rejected");
            } catch (error: any) {
              Alert.alert(isRTL ? "خطأ" : "Error", error.message);
            }
          },
        },
      ]
    );
  };

  const handleMarkReviewed = async (reportId: Id<"reportedMessages">) => {
    try {
      await markReportReviewed({ reportId });
      Alert.alert(
        isRTL ? "تم" : "Done",
        isRTL ? "تم وضع علامة على البلاغ كمراجع" : "Report marked as reviewed"
      );
    } catch (error: any) {
      Alert.alert(isRTL ? "خطأ" : "Error", error.message);
    }
  };

  const getPendingContent = () => {
    switch (selectedContentType) {
      case "lodgings":
        return pendingLodgings || [];
      case "foods":
        return pendingFoods || [];
      case "events":
        return pendingEvents || [];
      case "destinations":
        return pendingDestinations || [];
      case "services":
        return pendingServices || [];
      default:
        return [];
    }
  };

  const renderOverview = () => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      {/* User Stats */}
      <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
        {isRTL ? "المستخدمون" : "Users"}
      </Text>
      <View style={styles.statsGrid}>
        <StatCard
          label={isRTL ? "الإجمالي" : "Total"}
          value={stats?.users.total || 0}
          color="#0D7A5F"
        />
        <StatCard
          label={isRTL ? "مستخدمون" : "Users"}
          value={stats?.users.users || 0}
          color="#3B82F6"
        />
        <StatCard
          label={isRTL ? "أعمال" : "Business"}
          value={stats?.users.business || 0}
          color="#8B5CF6"
        />
        <StatCard
          label={isRTL ? "مقدمو خدمات" : "Providers"}
          value={stats?.users.providers || 0}
          color="#F59E0B"
        />
      </View>

      {/* Pending Content Stats */}
      <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
        {isRTL ? "المحتوى المعلق" : "Pending Content"}
      </Text>
      <View style={styles.statsGrid}>
        <StatCard
          label={isRTL ? "الإجمالي" : "Total"}
          value={stats?.pending.total || 0}
          color="#DC2626"
          highlight
        />
        <StatCard
          label={isRTL ? "إقامة" : "Lodging"}
          value={stats?.pending.lodgings || 0}
          color="#0D7A5F"
        />
        <StatCard
          label={isRTL ? "طعام" : "Food"}
          value={stats?.pending.foods || 0}
          color="#F59E0B"
        />
        <StatCard
          label={isRTL ? "فعاليات" : "Events"}
          value={stats?.pending.events || 0}
          color="#8B5CF6"
        />
        <StatCard
          label={isRTL ? "وجهات" : "Destinations"}
          value={stats?.pending.destinations || 0}
          color="#3B82F6"
        />
        <StatCard
          label={isRTL ? "خدمات" : "Services"}
          value={stats?.pending.services || 0}
          color="#EC4899"
        />
      </View>

      {/* Reports Stats */}
      <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
        {isRTL ? "بلاغات الذكاء الاصطناعي" : "AI Reports"}
      </Text>
      <View style={styles.statsGrid}>
        <StatCard
          label={isRTL ? "غير مراجعة" : "Unreviewed"}
          value={stats?.reports.unreviewed || 0}
          color="#DC2626"
          highlight={stats?.reports.unreviewed ? stats.reports.unreviewed > 0 : false}
        />
      </View>
    </Animated.View>
  );

  const renderPendingContent = () => {
    const content = getPendingContent();

    return (
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        {/* Content Type Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contentTypeScroll}
        >
          {(["lodgings", "foods", "events", "destinations", "services"] as ContentType[]).map(
            (type) => (
              <Pressable
                key={type}
                style={[
                  styles.contentTypeChip,
                  selectedContentType === type && styles.contentTypeChipActive,
                ]}
                onPress={() => setSelectedContentType(type)}
              >
                <Text
                  style={[
                    styles.contentTypeText,
                    selectedContentType === type && styles.contentTypeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {" ("}
                  {type === "lodgings" && (stats?.pending.lodgings || 0)}
                  {type === "foods" && (stats?.pending.foods || 0)}
                  {type === "events" && (stats?.pending.events || 0)}
                  {type === "destinations" && (stats?.pending.destinations || 0)}
                  {type === "services" && (stats?.pending.services || 0)}
                  {")"}
                </Text>
              </Pressable>
            )
          )}
        </ScrollView>

        {/* Content List */}
        {content.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {isRTL ? "لا يوجد محتوى معلق" : "No pending content"}
            </Text>
          </View>
        ) : (
          content.map((item: any) => (
            <View key={item._id} style={styles.contentCard}>
              <View style={styles.contentInfo}>
                <Text style={[styles.contentTitle, isRTL && styles.textRTL]}>
                  {isRTL ? item.nameAr || item.titleAr : item.name || item.title}
                </Text>
                <Text style={[styles.contentSubtitle, isRTL && styles.textRTL]}>
                  {item.type || item.category || item.serviceType}
                </Text>
                {item.description && (
                  <Text
                    style={[styles.contentDescription, isRTL && styles.textRTL]}
                    numberOfLines={2}
                  >
                    {isRTL ? item.descriptionAr : item.description}
                  </Text>
                )}
              </View>
              <View style={styles.contentActions}>
                <Pressable
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(selectedContentType, item._id)}
                >
                  <Text style={styles.approveButtonText}>
                    {isRTL ? "موافقة" : "Approve"}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(selectedContentType, item._id)}
                >
                  <Text style={styles.rejectButtonText}>
                    {isRTL ? "رفض" : "Reject"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </Animated.View>
    );
  };

  const renderReports = () => {
    const reports = unreviewedReports || [];

    return (
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {isRTL ? "بلاغات رسائل الذكاء الاصطناعي" : "AI Message Reports"}
        </Text>

        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {isRTL ? "لا توجد بلاغات غير مراجعة" : "No unreviewed reports"}
            </Text>
          </View>
        ) : (
          reports.map((report: any) => (
            <View key={report._id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportDate}>
                  {new Date(report.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.reportMessage, isRTL && styles.textRTL]}>
                "{report.messageText}"
              </Text>
              {report.reportReason && (
                <Text style={styles.reportReason}>
                  {isRTL ? "السبب: " : "Reason: "}
                  {report.reportReason}
                </Text>
              )}
              <Pressable
                style={styles.reviewedButton}
                onPress={() => handleMarkReviewed(report._id)}
              >
                <Text style={styles.reviewedButtonText}>
                  {isRTL ? "وضع علامة كمراجع" : "Mark as Reviewed"}
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </Animated.View>
    );
  };

  if (!stats) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0D7A5F" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{isRTL ? "رجوع" : "Back"}</Text>
        </Pressable>
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {isRTL ? "لوحة الإدارة" : "Admin Dashboard"}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "overview" && styles.tabActive]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabText, activeTab === "overview" && styles.tabTextActive]}>
            {isRTL ? "نظرة عامة" : "Overview"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.tabActive]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.tabTextActive]}>
            {isRTL ? "المعلق" : "Pending"}
            {stats.pending.total > 0 && (
              <Text style={styles.badge}> ({stats.pending.total})</Text>
            )}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "reports" && styles.tabActive]}
          onPress={() => setActiveTab("reports")}
        >
          <Text style={[styles.tabText, activeTab === "reports" && styles.tabTextActive]}>
            {isRTL ? "البلاغات" : "Reports"}
            {stats.reports.unreviewed > 0 && (
              <Text style={styles.badgeRed}> ({stats.reports.unreviewed})</Text>
            )}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === "overview" && renderOverview()}
        {activeTab === "pending" && renderPendingContent()}
        {activeTab === "reports" && renderReports()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.statCard, highlight && { borderColor: color, borderWidth: 2 }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#0D7A5F",
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  textRTL: {
    textAlign: "right",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#0D7A5F",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#737373",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  badge: {
    color: "#0D7A5F",
    fontWeight: "700",
  },
  badgeRed: {
    color: "#DC2626",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minWidth: "45%",
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
    color: "#737373",
    marginTop: 4,
  },
  contentTypeScroll: {
    marginBottom: 16,
  },
  contentTypeChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  contentTypeChipActive: {
    backgroundColor: "#0D7A5F",
    borderColor: "#0D7A5F",
  },
  contentTypeText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "500",
  },
  contentTypeTextActive: {
    color: "#FFFFFF",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#737373",
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contentInfo: {
    marginBottom: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  contentSubtitle: {
    fontSize: 13,
    color: "#0D7A5F",
    marginTop: 2,
    textTransform: "capitalize",
  },
  contentDescription: {
    fontSize: 14,
    color: "#737373",
    marginTop: 8,
    lineHeight: 20,
  },
  contentActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#0D7A5F",
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  rejectButtonText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 14,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  reportHeader: {
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: "#737373",
  },
  reportMessage: {
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
    fontStyle: "italic",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reportReason: {
    fontSize: 13,
    color: "#737373",
    marginBottom: 12,
  },
  reviewedButton: {
    backgroundColor: "#0D7A5F",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  reviewedButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
});
