import React, { useRef, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "@/hooks/useLanguage";

// Import screen content components
import {
  HomeScreenContent,
  LodgingScreenContent,
  FoodScreenContent,
  EventsScreenContent,
  PlannerScreenContent,
  MomentsScreenContent,
  SettingsScreenContent,
} from "@/components/screens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface TabItem {
  key: string;
  labelKey: "home" | "lodging" | "food" | "events" | "planner" | "moments" | "settings";
  icon: keyof typeof Feather.glyphMap;
}

const tabs: TabItem[] = [
  { key: "home", labelKey: "home", icon: "home" },
  { key: "lodging", labelKey: "lodging", icon: "map-pin" },
  { key: "food", labelKey: "food", icon: "coffee" },
  { key: "events", labelKey: "events", icon: "calendar" },
  { key: "planner", labelKey: "planner", icon: "message-circle" },
  { key: "moments", labelKey: "moments", icon: "camera" },
  { key: "settings", labelKey: "settings", icon: "settings" },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useSharedValue(0);

  const handlePageScroll = useCallback((e: any) => {
    const { position, offset } = e.nativeEvent;
    scrollPosition.value = position + offset;
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    const position = e.nativeEvent.position;
    setCurrentPage(position);
  }, []);

  const handleTabPress = useCallback((index: number) => {
    pagerRef.current?.setPage(index);
  }, []);

  const handleNavigateToTab = useCallback((index: number) => {
    pagerRef.current?.setPage(index);
  }, []);

  // Auto-scroll tab bar to keep active tab visible
  React.useEffect(() => {
    if (scrollViewRef.current) {
      const tabWidth = 100;
      const scrollPosition = Math.max(0, currentPage * tabWidth - 100);
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  }, [currentPage]);

  const renderScreen = (key: string) => {
    switch (key) {
      case "home":
        return <HomeScreenContent onNavigateToTab={handleNavigateToTab} />;
      case "lodging":
        return <LodgingScreenContent />;
      case "food":
        return <FoodScreenContent />;
      case "events":
        return <EventsScreenContent />;
      case "planner":
        return <PlannerScreenContent onNavigateToTab={handleNavigateToTab} />;
      case "moments":
        return <MomentsScreenContent />;
      case "settings":
        return <SettingsScreenContent />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Pager View for native swipeable content */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageScroll={handlePageScroll}
        onPageSelected={handlePageSelected}
        overdrag={true}
        overScrollMode="always"
      >
        {tabs.map((tab) => (
          <View key={tab.key} style={styles.page}>
            {renderScreen(tab.key)}
          </View>
        ))}
      </PagerView>

      {/* Custom Tab Bar */}
      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {tabs.map((tab, index) => {
            const isActive = currentPage === index;
            return (
              <TabButton
                key={tab.key}
                label={t(tab.labelKey)}
                icon={tab.icon}
                isActive={isActive}
                scrollPosition={scrollPosition}
                tabIndex={index}
                onPress={() => handleTabPress(index)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

interface TabButtonProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  isActive: boolean;
  scrollPosition: Animated.SharedValue<number>;
  tabIndex: number;
  onPress: () => void;
}

function TabButton({ label, icon, isActive, scrollPosition, tabIndex, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animate text color and indicator based on scroll position
  const textStyle = useAnimatedStyle(() => {
    'worklet';
    const distance = Math.abs(scrollPosition.value - tabIndex);
    const progress = Math.max(0, Math.min(1, 1 - distance));

    const color = interpolateColor(
      progress,
      [0, 1],
      ["#737373", "#0D7A5F"]
    );

    return {
      color,
      fontWeight: progress > 0.5 ? "600" : "500",
    };
  });

  const iconOpacity = useAnimatedStyle(() => {
    'worklet';
    const distance = Math.abs(scrollPosition.value - tabIndex);
    const progress = Math.max(0, Math.min(1, 1 - distance));

    return {
      opacity: 0.5 + (progress * 0.5),
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    'worklet';
    const distance = Math.abs(scrollPosition.value - tabIndex);
    const progress = Math.max(0, Math.min(1, 1 - distance));

    return {
      opacity: progress,
      transform: [{ scaleX: progress }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      style={[styles.tabButton, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.tabContent}>
        <Animated.View style={iconOpacity}>
          <Feather
            name={icon}
            size={14}
            color={isActive ? "#0D7A5F" : "#A3A3A3"}
            style={styles.tabIcon}
          />
        </Animated.View>
        <AnimatedText style={[styles.tabLabel, textStyle]}>
          {label}
        </AnimatedText>
      </View>
      <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E5E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    position: "relative",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabIcon: {
    opacity: 0.9,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: "#0D7A5F",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 4,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "#0D7A5F",
    borderRadius: 2,
  },
});
