import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { useAppStore } from "@/stores/appStore";
import { MomentCard } from "@/components/moments/MomentCard";
import { Button } from "@/components/ui";
import type { Moment } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MomentsScreenContent() {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useLanguage();

  const moments = useAppStore((state) => state.moments);
  const addMoment = useAppStore((state) => state.addMoment);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMomentImage, setNewMomentImage] = useState<string | null>(null);
  const [newMomentNote, setNewMomentNote] = useState("");
  const [newMomentLocation, setNewMomentLocation] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewMomentImage(result.assets[0].uri);
    }
  };

  const handleAddMoment = () => {
    if (!newMomentImage) return;

    const moment: Moment = {
      id: Date.now().toString(),
      image: newMomentImage,
      note: newMomentNote,
      location: newMomentLocation || undefined,
      timestamp: new Date().toISOString(),
    };

    addMoment(moment);
    setModalVisible(false);
    setNewMomentImage(null);
    setNewMomentNote("");
    setNewMomentLocation("");
  };

  const renderItem = ({ item, index }: { item: Moment; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.cardWrapper}
    >
      <MomentCard moment={item} isRTL={isRTL} />
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={[styles.header, isRTL && styles.headerRTL]}
      >
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t("myMoments")}
        </Text>
        <AddButton label={t("addMoment")} onPress={() => setModalVisible(true)} />
      </Animated.View>

      {/* Moments Grid */}
      {moments.length > 0 ? (
        <FlatList
          data={moments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, isRTL && styles.textRTL]}>
            {t("emptyMomentsTitle")}
          </Text>
          <Text style={[styles.emptyMessage, isRTL && styles.textRTL]}>
            {t("emptyMomentsMessage")}
          </Text>
          <Button
            title={t("emptyMomentsAction")}
            onPress={() => setModalVisible(true)}
            style={styles.emptyButton}
          />
        </View>
      )}

      {/* Add Moment Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={[styles.modalHeader, isRTL && styles.modalHeaderRTL]}>
              <Text style={[styles.modalTitle, isRTL && styles.textRTL]}>
                {t("addMoment")}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>{t("cancel")}</Text>
              </Pressable>
            </View>

            <Pressable style={styles.imagePicker} onPress={pickImage}>
              {newMomentImage ? (
                <Animated.Image
                  source={{ uri: newMomentImage }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.imagePickerText}>{t("selectPhoto")}</Text>
              )}
            </Pressable>

            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t("writeNote")}
              placeholderTextColor="#A3A3A3"
              value={newMomentNote}
              onChangeText={setNewMomentNote}
              multiline
              numberOfLines={3}
              textAlign={isRTL ? "right" : "left"}
            />

            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t("addLocation")}
              placeholderTextColor="#A3A3A3"
              value={newMomentLocation}
              onChangeText={setNewMomentLocation}
              textAlign={isRTL ? "right" : "left"}
            />

            <Button
              title={t("save")}
              onPress={handleAddMoment}
              fullWidth
              disabled={!newMomentImage}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface AddButtonProps {
  label: string;
  onPress: () => void;
}

function AddButton({ label, onPress }: AddButtonProps) {
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
      style={[styles.addButton, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={styles.addButtonText}>+ {label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerRTL: {
    flexDirection: "row-reverse",
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
  addButton: {
    backgroundColor: "#0D7A5F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    marginBottom: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    color: "#737373",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderRTL: {
    flexDirection: "row-reverse",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cancelText: {
    fontSize: 16,
    color: "#737373",
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F5F1EB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#737373",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  input: {
    backgroundColor: "#F5F1EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
    marginBottom: 12,
  },
  inputRTL: {
    writingDirection: "rtl",
  },
});
