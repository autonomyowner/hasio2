// Language
export type Language = "en" | "ar";

// Lodging Types
export type LodgingType = "hotel" | "apartment" | "camp" | "homestay";

export interface Lodging {
  id: string;
  name: string;
  nameAr: string;
  type: LodgingType;
  city: string;
  cityAr: string;
  neighborhood: string;
  neighborhoodAr: string;
  priceRange: string;
  rating: number;
  images: string[];
  amenities: string[];
  amenitiesAr: string[];
  description: string;
  descriptionAr: string;
}

// Food Types
export type FoodCategory = "restaurant" | "home_kitchen" | "fastfood" | "drinks";

export interface Food {
  id: string;
  name: string;
  nameAr: string;
  category: FoodCategory;
  cuisine: string;
  cuisineAr: string;
  avgPrice: string;
  hours: string;
  images: string[];
  description: string;
  descriptionAr: string;
  rating: number;
}

// Event Types
export type EventCategory = "festival" | "conference" | "outdoor" | "indoor" | "seasonal";

export interface Event {
  id: string;
  title: string;
  titleAr: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  locationAr: string;
  images: string[];
  description: string;
  descriptionAr: string;
}

// Plan Types
export interface PlanItem {
  id: string;
  time: string;
  type: "lodging" | "food" | "event";
  refId: string;
  note: string;
}

export interface DayPlan {
  id: string;
  date: string;
  items: PlanItem[];
}

// Moment Type
export interface Moment {
  id: string;
  image: string;
  note: string;
  location?: string;
  timestamp: string;
}

// User Types
export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthUser | null;
}

// Chat Message Type
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

// Filter Types
export type LodgingFilter = "all" | LodgingType;
export type FoodFilter = "all" | FoodCategory;
export type EventFilter = "all" | EventCategory;
