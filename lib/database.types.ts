// Supabase Database Types for Hasio
// These types match your database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lodging: {
        Row: {
          id: string;
          name: string;
          name_ar: string;
          type: "hotel" | "apartment" | "camp" | "homestay";
          city: string;
          city_ar: string;
          neighborhood: string;
          neighborhood_ar: string;
          price_range: string;
          rating: number;
          images: string[];
          amenities: string[];
          amenities_ar: string[];
          description: string;
          description_ar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lodging"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["lodging"]["Insert"]>;
      };
      food: {
        Row: {
          id: string;
          name: string;
          name_ar: string;
          category: "restaurant" | "home_kitchen" | "fastfood" | "drinks";
          cuisine: string;
          cuisine_ar: string;
          avg_price: string;
          hours: string;
          images: string[];
          description: string;
          description_ar: string;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["food"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["food"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          title_ar: string;
          category: "festival" | "conference" | "outdoor" | "indoor" | "seasonal";
          date: string;
          time: string;
          location: string;
          location_ar: string;
          images: string[];
          description: string;
          description_ar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          item_type: "lodging" | "food" | "event";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorites"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
      };
      moments: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          note: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moments"]["Insert"]>;
      };
      day_plans: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["day_plans"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["day_plans"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          language: "en" | "ar";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
