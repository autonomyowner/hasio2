import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  Alert,
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
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { getProfile, upgradeUserType } from "@/lib/auth";
import { Profile, UserType } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsScreenContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, language, changeLanguage, isRTL } = useLanguage();

  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const notificationsEnabled = useAppStore((state) => state.notificationsEnabled);
  const toggleNotifications = useAppStore((state) => state.toggleNotifications);
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);

  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    const { profile: fetchedProfile } = await getProfile(user.id);
    setProfile(fetchedProfile);
  };

  const handleSignOut = () => {
    setOnboardingComplete(false);
    router.replace("/onboarding");
  };

  const handleUpgrade = async (newType: "business" | "provider") => {
    if (!user?.id) return;

    setIsUpgrading(true);
    const { success, error } = await upgradeUserType(user.id, newType);
    setIsUpgrading(false);

    if (success) {
      Alert.alert(t("upgradeSuccess"), "", [
        {
          text: "OK",
          onPress: () => {
            setShowUpgradeModal(false);
            fetchProfile();
          },
        },
      ]);
    } else {
      Alert.alert(t("upgradeError"), error || "Unknown error");
    }
  };

  const getUserTypeLabel = (type?: UserType) => {
    switch (type) {
      case "business":
        return t("userTypeBusiness");
      case "provider":
        return t("userTypeProvider");
      default:
        return t("userTypeUser");
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
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("settings")}
          </Text>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("preferences")}
          </Text>

          <SettingRow
            label={t("language")}
            value={language === "en" ? "English" : "العربية"}
            isRTL={isRTL}
            onPress={() => changeLanguage(language === "en" ? "ar" : "en")}
          />

          <SettingRowWithSwitch
            label={t("notifications")}
            value={notificationsEnabled}
            isRTL={isRTL}
            onToggle={toggleNotifications}
          />

          <SettingRowWithSwitch
            label={t("darkMode")}
            value={isDarkMode}
            isRTL={isRTL}
            onToggle={toggleDarkMode}
          />
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("account")}
          </Text>

          <SettingRow
            label={t("profile")}
            subtitle={t("manageProfile")}
            isRTL={isRTL}
          />

          {/* Dashboard link for business users */}
          {profile?.user_type === "business" && (
            <SettingRow
              label={t("businessDashboard")}
              subtitle={t("manageListings")}
              isRTL={isRTL}
              onPress={() => router.push("/business/dashboard")}
            />
          )}

          {/* Dashboard link for provider users */}
          {profile?.user_type === "provider" && (
            <SettingRow
              label={t("providerDashboard")}
              subtitle={t("manageServices")}
              isRTL={isRTL}
              onPress={() => router.push("/provider/dashboard")}
            />
          )}

          {/* Upgrade option for normal users */}
          {profile?.user_type === "user" && (
            <SettingRow
              label={t("upgradeAccount")}
              subtitle={t("becomeBusinessOrProvider")}
              isRTL={isRTL}
              onPress={() => setShowUpgradeModal(true)}
            />
          )}

          <SettingRow
            label={t("favorites")}
            subtitle={t("savedPlaces")}
            isRTL={isRTL}
          />

          <SettingRow
            label={t("privacySecurity")}
            subtitle={t("manageData")}
            isRTL={isRTL}
          />

          <SettingRow
            label={t("signOut")}
            subtitle={t("signOutSubtitle")}
            isRTL={isRTL}
            onPress={handleSignOut}
            destructive
          />
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t("support")}
          </Text>

          <SettingRow
            label={t("rateApp")}
            subtitle={t("shareFeedback")}
            isRTL={isRTL}
          />

          <SettingRow
            label={t("about")}
            subtitle={t("appVersionInfo")}
            isRTL={isRTL}
          />
        </Animated.View>

        {/* App Info */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.appInfo}
        >
          <Text style={[styles.appName, isRTL && styles.textRTL]}>
            {t("appName")}
          </Text>
          <Text style={[styles.version, isRTL && styles.textRTL]}>
            {t("version")}
          </Text>
          <Text style={[styles.appDescription, isRTL && styles.textRTL]}>
            {t("appDescription")}
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, isRTL && styles.textRTL]}>
              {t("upgradeAccount")}
            </Text>
            <Text style={[styles.modalSubtitle, isRTL && styles.textRTL]}>
              {t("upgradeWarning")}
            </Text>

            <Pressable
              style={styles.upgradeOption}
              onPress={() => handleUpgrade("business")}
              disabled={isUpgrading}
            >
              <Text style={[styles.upgradeOptionTitle, isRTL && styles.textRTL]}>
                {t("userTypeBusiness")}
              </Text>
              <Text style={[styles.upgradeOptionDesc, isRTL && styles.textRTL]}>
                {t("userTypeBusinessDesc")}
              </Text>
            </Pressable>

            <Pressable
              style={styles.upgradeOption}
              onPress={() => handleUpgrade("provider")}
              disabled={isUpgrading}
            >
              <Text style={[styles.upgradeOptionTitle, isRTL && styles.textRTL]}>
                {t("userTypeProvider")}
              </Text>
              <Text style={[styles.upgradeOptionDesc, isRTL && styles.textRTL]}>
                {t("userTypeProviderDesc")}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface SettingRowProps {
  label: string;
  subtitle?: string;
  value?: string;
  isRTL: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingRow({
  label,
  subtitle,
  value,
  isRTL,
  onPress,
  destructive,
}: SettingRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  return (
    <AnimatedPressable
      style={[styles.settingRow, isRTL && styles.settingRowRTL, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
    >
      <View style={[styles.settingInfo, isRTL && styles.settingInfoRTL]}>
        <Text
          style={[
            styles.settingLabel,
            isRTL && styles.textRTL,
            destructive && styles.destructiveText,
          ]}
        >
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, isRTL && styles.textRTL]}>
            {subtitle}
          </Text>
        )}
      </View>
      {value && (
        <Text style={[styles.settingValue, isRTL && styles.textRTL]}>
          {value}
        </Text>
      )}
    </AnimatedPressable>
  );
}

interface SettingRowWithSwitchProps {
  label: string;
  value: boolean;
  isRTL: boolean;
  onToggle: () => void;
}

function SettingRowWithSwitch({
  label,
  value,
  isRTL,
  onToggle,
}: SettingRowWithSwitchProps) {
  return (
    <View style={[styles.settingRow, isRTL && styles.settingRowRTL]}>
      <Text style={[styles.settingLabel, isRTL && styles.textRTL]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E8E5E0", true: "#0D7A5F" }}
        thumbColor="#FFFFFF"
      />
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  textRTL: {
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitleRTL: {
    textAlign: "right",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  settingRowRTL: {
    flexDirection: "row-reverse",
  },
  settingInfo: {
    flex: 1,
  },
  settingInfoRTL: {
    alignItems: "flex-end",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#737373",
    marginTop: 2,
  },
  settingValue: {
    fontSize: 15,
    color: "#0D7A5F",
    fontWeight: "500",
  },
  destructiveText: {
    color: "#DC6B5A",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D7A5F",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#737373",
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 32,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#737373",
    marginBottom: 24,
  },
  upgradeOption: {
    backgroundColor: "#FAF7F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  upgradeOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  upgradeOptionDesc: {
    fontSize: 14,
    color: "#737373",
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#737373",
    fontWeight: "500",
  },
});
