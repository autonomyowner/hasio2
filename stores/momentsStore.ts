import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export interface Moment {
  id: string;
  user_id: string;
  image_url: string;
  note: string | null;
  location: string | null;
  created_at: string;
}

interface MomentsState {
  moments: Moment[];
  isLoading: boolean;
  error: string | null;
  fetchMoments: () => Promise<void>;
  addMoment: (imageUri: string, note?: string, location?: string) => Promise<boolean>;
  deleteMoment: (id: string, imageUrl: string) => Promise<boolean>;
  clearMoments: () => void;
}

export const useMomentsStore = create<MomentsState>((set, get) => ({
  moments: [],
  isLoading: false,
  error: null,

  fetchMoments: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ moments: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from("moments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ moments: data || [], isLoading: false });
    } catch (error: any) {
      console.error("Error fetching moments:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  addMoment: async (imageUri: string, note?: string, location?: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ error: "User not authenticated", isLoading: false });
        return false;
      }

      // Handle content:// URIs on Android by copying to cache first
      let localUri = imageUri;
      if (imageUri.startsWith("content://") || imageUri.startsWith("ph://")) {
        const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
        const cacheUri = `${FileSystem.cacheDirectory}temp_moment_${Date.now()}.${fileExt}`;
        await FileSystem.copyAsync({
          from: imageUri,
          to: cacheUri,
        });
        localUri = cacheUri;
      }

      // Read the image file and convert to base64
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: "base64",
      });

      // Clean up temp file if we created one
      if (localUri !== imageUri) {
        FileSystem.deleteAsync(localUri, { idempotent: true }).catch(() => {});
      }

      // Generate unique filename
      const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("moments")
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("moments")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Insert moment record
      const { data: momentData, error: insertError } = await supabase
        .from("moments")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          note: note || null,
          location: location || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Add to local state
      set((state) => ({
        moments: [momentData, ...state.moments],
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      console.error("Error adding moment:", error.message);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  deleteMoment: async (id: string, imageUrl: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ error: "User not authenticated", isLoading: false });
        return false;
      }

      // Extract file path from URL
      const urlParts = imageUrl.split("/moments/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        // Delete from storage
        await supabase.storage.from("moments").remove([filePath]);
      }

      // Delete moment record
      const { error: deleteError } = await supabase
        .from("moments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Remove from local state
      set((state) => ({
        moments: state.moments.filter((m) => m.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      console.error("Error deleting moment:", error.message);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  clearMoments: () => {
    set({ moments: [], error: null });
  },
}));
