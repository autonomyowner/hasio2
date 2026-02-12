import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { mockLodging, mockFood, mockEvents, featuredDestinations } from "@/constants/mockData";
import type { LodgingType, FoodCategory, EventCategory } from "@/types";

/**
 * Hook to get lodgings from Convex with fallback to mock data
 */
export function useLodgings(type?: LodgingType) {
  // Try to get data from Convex
  const convexData = useQuery(api.lodgings.list, type ? { type } : {});

  // While loading or if Convex returns undefined, use mock data
  const isLoading = convexData === undefined;

  // Transform Convex data to match the expected shape
  const data = convexData?.map((item) => ({
    id: item._id,
    name: item.name,
    nameAr: item.nameAr,
    type: item.type,
    city: item.city,
    cityAr: item.cityAr,
    neighborhood: item.neighborhood || "",
    neighborhoodAr: item.neighborhoodAr || "",
    priceRange: item.priceRange || "",
    rating: item.rating,
    images: item.images,
    amenities: item.amenities,
    amenitiesAr: item.amenitiesAr,
    description: item.description || "",
    descriptionAr: item.descriptionAr || "",
    owner_id: item.ownerId?.toString(),
    status: item.status,
  }));

  // Fallback to mock data if no Convex data
  const lodgings = data && data.length > 0 ? data : mockLodging;

  // Filter by type if needed and using mock data
  const filteredLodgings = type && lodgings === mockLodging
    ? lodgings.filter((l) => l.type === type)
    : lodgings;

  return {
    lodgings: filteredLodgings,
    isLoading,
    isUsingMockData: !data || data.length === 0,
  };
}

/**
 * Hook to get foods from Convex with fallback to mock data
 */
export function useFoods(category?: FoodCategory) {
  const convexData = useQuery(api.foods.list, category ? { category } : {});

  const isLoading = convexData === undefined;

  const data = convexData?.map((item) => ({
    id: item._id,
    name: item.name,
    nameAr: item.nameAr,
    category: item.category,
    cuisine: item.cuisine || "",
    cuisineAr: item.cuisineAr || "",
    avgPrice: item.avgPrice || "",
    hours: item.hours || "",
    images: item.images,
    description: item.description || "",
    descriptionAr: item.descriptionAr || "",
    rating: item.rating,
    owner_id: item.ownerId?.toString(),
    status: item.status,
  }));

  const foods = data && data.length > 0 ? data : mockFood;

  const filteredFoods = category && foods === mockFood
    ? foods.filter((f) => f.category === category)
    : foods;

  return {
    foods: filteredFoods,
    isLoading,
    isUsingMockData: !data || data.length === 0,
  };
}

/**
 * Hook to get events from Convex with fallback to mock data
 */
export function useEvents(category?: EventCategory) {
  const convexData = useQuery(api.events.list, category ? { category } : {});

  const isLoading = convexData === undefined;

  const data = convexData?.map((item) => ({
    id: item._id,
    title: item.title,
    titleAr: item.titleAr,
    category: item.category,
    date: item.date,
    time: item.time || "",
    location: item.location || "",
    locationAr: item.locationAr || "",
    images: item.images,
    description: item.description || "",
    descriptionAr: item.descriptionAr || "",
    owner_id: item.ownerId?.toString(),
    status: item.status,
  }));

  const events = data && data.length > 0 ? data : mockEvents;

  const filteredEvents = category && events === mockEvents
    ? events.filter((e) => e.category === category)
    : events;

  return {
    events: filteredEvents,
    isLoading,
    isUsingMockData: !data || data.length === 0,
  };
}

/**
 * Hook to get destinations from Convex with fallback to mock data
 */
export function useDestinations(featured?: boolean) {
  const convexData = useQuery(api.destinations.list, featured !== undefined ? { featured } : {});

  const isLoading = convexData === undefined;

  const data = convexData?.map((item) => ({
    id: item._id,
    name: item.name,
    nameAr: item.nameAr,
    subtitle: item.subtitle || "",
    subtitleAr: item.subtitleAr || "",
    image: item.images[0] || "",
    featured: item.featured || false,
    category: item.category,
    city: item.city,
    cityAr: item.cityAr,
    description: item.description || "",
    descriptionAr: item.descriptionAr || "",
    rating: item.rating,
  }));

  const destinations = data && data.length > 0 ? data : featuredDestinations;

  const filteredDestinations = featured !== undefined && destinations === featuredDestinations
    ? destinations.filter((d) => d.featured === featured)
    : destinations;

  return {
    destinations: filteredDestinations,
    isLoading,
    isUsingMockData: !data || data.length === 0,
  };
}

/**
 * Hook to get all data for home screen search
 */
export function useHomeData() {
  const { lodgings, isLoading: lodgingsLoading } = useLodgings();
  const { foods, isLoading: foodsLoading } = useFoods();
  const { events, isLoading: eventsLoading } = useEvents();
  const { destinations, isLoading: destinationsLoading } = useDestinations();

  return {
    lodgings,
    foods,
    events,
    destinations,
    isLoading: lodgingsLoading || foodsLoading || eventsLoading || destinationsLoading,
  };
}
