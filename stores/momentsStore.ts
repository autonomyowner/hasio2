import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { File, Paths } from "expo-file-system/next";
import { decode } from "base64-arraybuffer";

// Helper to convert base64 to Uint8Array (more reliable than decode in some RN builds)
function base64ToUint8Array(base64: string): Uint8Array {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Remove padding
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const base64Clean = base64.replace(/=/g, '');

  const bytes = new Uint8Array((base64Clean.length * 3) / 4 - padding);
  let byteIndex = 0;

  for (let i = 0; i < base64Clean.length; i += 4) {
    const a = base64Chars.indexOf(base64Clean[i]);
    const b = base64Chars.indexOf(base64Clean[i + 1]);
    const c = base64Chars.indexOf(base64Clean[i + 2]);
    const d = base64Chars.indexOf(base64Clean[i + 3]);

    bytes[byteIndex++] = (a << 2) | (b >> 4);
    if (byteIndex < bytes.length) bytes[byteIndex++] = ((b & 15) << 4) | (c >> 2);
    if (byteIndex < bytes.length) bytes[byteIndex++] = ((c & 3) << 6) | d;
  }

  return bytes;
}

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
      console.log("Adding moment with URI:", imageUri);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("User not authenticated");
        set({ error: "User not authenticated", isLoading: false });
        return false;
      }

      console.log("User ID:", user.id);

      // Determine file extension - default to jpg for content:// URIs
      let fileExt = "jpg";
      if (imageUri.includes(".")) {
        const ext = imageUri.split(".").pop()?.toLowerCase();
        if (ext && ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          fileExt = ext;
        }
      }

      // Read file using new File API
      console.log("Reading file as base64...");
      const file = new File(imageUri);
      const base64 = await file.base64();
      console.log("Base64 length:", base64.length);

      // Generate unique filename
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      console.log("Uploading to:", fileName);

      // Upload to Supabase Storage
      console.log("Starting Supabase upload...");

      // Try using decode first, fall back to custom decoder if it fails
      let uploadData: ArrayBuffer | Uint8Array;
      try {
        uploadData = decode(base64);
      } catch (decodeError) {
        console.log("decode() failed, using fallback:", decodeError);
        uploadData = base64ToUint8Array(base64);
      }

      const { error: uploadError } = await supabase.storage
        .from("moments")
        .upload(fileName, uploadData, {
          contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error details:", JSON.stringify(uploadError, null, 2));
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
      }
      console.log("Upload successful!");

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("moments")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      console.log("Image URL:", imageUrl);

      // Insert moment record
      console.log("Inserting moment record...");
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

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
      console.log("Moment saved successfully!");

      // Add to local state
      set((state) => ({
        moments: [momentData, ...state.moments],
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      const errorMsg = error?.message || error?.toString() || "Unknown error occurred";
      console.error("Error adding moment:", errorMsg);
      console.error("Full error:", JSON.stringify(error, null, 2));
      set({ error: errorMsg, isLoading: false });
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
