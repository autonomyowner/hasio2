import { supabase } from "./supabase";
import type { Database } from "./database.types";

type Lodging = Database["public"]["Tables"]["lodging"]["Row"];
type Food = Database["public"]["Tables"]["food"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"];
type Moment = Database["public"]["Tables"]["moments"]["Row"];
type Favorite = Database["public"]["Tables"]["favorites"]["Row"];

// ============ LODGING ============

export async function getLodging(type?: string) {
  let query = supabase.from("lodging").select("*").order("rating", { ascending: false });

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching lodging:", error.message);
    return [];
  }

  return data as Lodging[];
}

export async function getLodgingById(id: string) {
  const { data, error } = await supabase
    .from("lodging")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching lodging:", error.message);
    return null;
  }

  return data as Lodging;
}

// ============ FOOD ============

export async function getFood(category?: string) {
  let query = supabase.from("food").select("*").order("rating", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching food:", error.message);
    return [];
  }

  return data as Food[];
}

export async function getFoodById(id: string) {
  const { data, error } = await supabase
    .from("food")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching food:", error.message);
    return null;
  }

  return data as Food;
}

// ============ EVENTS ============

export async function getEvents(category?: string) {
  let query = supabase.from("events").select("*").order("date", { ascending: true });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error.message);
    return [];
  }

  return data as Event[];
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error.message);
    return null;
  }

  return data as Event;
}

// ============ FAVORITES ============

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error.message);
    return [];
  }

  return data as Favorite[];
}

export async function addFavorite(userId: string, itemId: string, itemType: "lodging" | "food" | "event") {
  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, item_id: itemId, item_type: itemType })
    .select()
    .single();

  if (error) {
    console.error("Error adding favorite:", error.message);
    return null;
  }

  return data as Favorite;
}

export async function removeFavorite(userId: string, itemId: string) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (error) {
    console.error("Error removing favorite:", error.message);
    return false;
  }

  return true;
}

export async function isFavorite(userId: string, itemId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle();

  if (error) {
    console.error("Error checking favorite:", error.message);
    return false;
  }

  return data !== null;
}

// ============ MOMENTS ============

export async function getMoments(userId: string) {
  const { data, error } = await supabase
    .from("moments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching moments:", error.message);
    return [];
  }

  return data as Moment[];
}

export async function addMoment(userId: string, imageUrl: string, note?: string, location?: string) {
  const { data, error } = await supabase
    .from("moments")
    .insert({
      user_id: userId,
      image_url: imageUrl,
      note: note || null,
      location: location || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding moment:", error.message);
    return null;
  }

  return data as Moment;
}

export async function deleteMoment(userId: string, momentId: string) {
  const { error } = await supabase
    .from("moments")
    .delete()
    .eq("user_id", userId)
    .eq("id", momentId);

  if (error) {
    console.error("Error deleting moment:", error.message);
    return false;
  }

  return true;
}

// ============ IMAGE UPLOAD ============

export async function uploadMomentImage(userId: string, fileUri: string) {
  const fileName = `${userId}/${Date.now()}.jpg`;

  // For React Native, we need to read the file and upload
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from("moments")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("moments")
    .getPublicUrl(fileName);

  return publicUrl;
}

// ============ PROFILE ============

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: { full_name?: string; language?: "en" | "ar" }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error.message);
    return null;
  }

  return data;
}

// ============ SEARCH ============

export async function searchAll(query: string) {
  const searchTerm = `%${query}%`;

  const [lodgingResult, foodResult, eventsResult] = await Promise.all([
    supabase
      .from("lodging")
      .select("*")
      .or(`name.ilike.${searchTerm},name_ar.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(5),
    supabase
      .from("food")
      .select("*")
      .or(`name.ilike.${searchTerm},name_ar.ilike.${searchTerm},cuisine.ilike.${searchTerm}`)
      .limit(5),
    supabase
      .from("events")
      .select("*")
      .or(`title.ilike.${searchTerm},title_ar.ilike.${searchTerm},location.ilike.${searchTerm}`)
      .limit(5),
  ]);

  return {
    lodging: lodgingResult.data || [],
    food: foodResult.data || [],
    events: eventsResult.data || [],
  };
}
