import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed data - this is the mock data from the app
const mockLodging = [
  {
    name: "Al-Ahsa InterContinental",
    nameAr: "فندق انتركونتيننتال الأحساء",
    type: "hotel" as const,
    city: "Al-Hofuf",
    cityAr: "الهفوف",
    neighborhood: "Al-Ahsa",
    neighborhoodAr: "الأحساء",
    priceRange: "450-650 SAR",
    rating: 4.7,
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/intercontinental-aea218dd.webp"],
    amenities: ["Wi-Fi", "Pool", "Spa", "Date Palm Gardens", "Traditional Dining", "Prayer Room"],
    amenitiesAr: ["واي فاي", "مسبح", "سبا", "حدائق النخيل", "مطعم تراثي", "مصلى"],
    description: "Luxury hotel in the heart of Al-Ahsa Oasis with views of ancient date palm groves and traditional architecture.",
    descriptionAr: "فندق فاخر في قلب واحة الأحساء مع إطلالات على بساتين النخيل القديمة والعمارة التراثية.",
  },
  {
    name: "Kayan Al Bustan Apartments",
    nameAr: "شقق كيان البستان",
    type: "apartment" as const,
    city: "Al-Hofuf",
    cityAr: "الهفوف",
    neighborhood: "Al-Ahsa",
    neighborhoodAr: "الأحساء",
    priceRange: "300-450 SAR",
    rating: 4.8,
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/kayan-apartments-f7de2915.jpg"],
    amenities: ["Wi-Fi", "Traditional Kitchen", "Parking", "Mountain Views", "Prayer Room", "Date Garden Access"],
    amenitiesAr: ["واي فاي", "مطبخ تراثي", "موقف سيارات", "إطلالة الجبل", "مصلى", "حديقة النخيل"],
    description: "Authentic Al-Ahsa apartment near Jabal Al-Qara caves with traditional Hasawi architecture and oasis views.",
    descriptionAr: "شقة أصيلة في الأحساء بالقرب من كهوف جبل القارة مع العمارة الحساوية التراثية وإطلالات الواحة.",
  },
  {
    name: "Al-Ahsa Desert Camp",
    nameAr: "مخيم صحراء الأحساء",
    type: "camp" as const,
    city: "Eastern Desert",
    cityAr: "الصحراء الشرقية",
    neighborhood: "Al-Ahsa",
    neighborhoodAr: "الأحساء",
    priceRange: "800-1200 SAR",
    rating: 4.9,
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/desert-camp-a2dc07bf.jpg"],
    amenities: ["Traditional Meals", "Camel Rides", "Falconry", "Stargazing", "Bedouin Stories", "Date Harvesting"],
    amenitiesAr: ["وجبات تراثية", "ركوب الجمال", "الصقارة", "مراقبة النجوم", "قصص بدوية", "جني التمور"],
    description: "Authentic desert experience on the edge of Al-Ahsa Oasis with traditional Bedouin hospitality and date palm excursions.",
    descriptionAr: "تجربة صحراوية أصيلة على حافة واحة الأحساء مع الضيافة البدوية التراثية ورحلات بساتين النخيل.",
  },
];

const mockFood = [
  {
    name: "Al-Ahsa Traditional Restaurant",
    nameAr: "مطعم الأحساء التراثي",
    category: "restaurant" as const,
    cuisine: "Hasawi Traditional",
    cuisineAr: "حساوي تراثي",
    avgPrice: "80-150 SAR",
    hours: "12:00 PM - 11:00 PM",
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/traditional-restaurant-7f7a7b7f.webp"],
    description: "Authentic Hasawi cuisine featuring date-stuffed lamb, traditional rice dishes, and fresh seafood from Al-Uqair.",
    descriptionAr: "مأكولات حساوية أصيلة تتميز بالخروف المحشو بالتمر وأطباق الأرز التراثية والمأكولات البحرية الطازجة من العقير.",
    rating: 4.8,
  },
  {
    name: "Sultanah Kitchen",
    nameAr: "مطبخ سلطانة",
    category: "home_kitchen" as const,
    cuisine: "Home-style Hasawi",
    cuisineAr: "حساوي منزلي",
    avgPrice: "40-80 SAR",
    hours: "5:00 PM - 10:00 PM",
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/sultanah-kitchen-78cc88d7.jpg"],
    description: "Traditional Hasawi dishes prepared by local productive families, featuring date-based sweets and oasis vegetables.",
    descriptionAr: "أطباق حساوية تراثية محضرة من قبل الأسر المنتجة المحلية، تتميز بالحلويات المعتمدة على التمر وخضروات الواحة.",
    rating: 4.9,
  },
  {
    name: "Qahwat Al-Ahsa",
    nameAr: "قهوة الأحساء",
    category: "drinks" as const,
    cuisine: "Traditional Beverages",
    cuisineAr: "مشروبات تراثية",
    avgPrice: "15-35 SAR",
    hours: "5:00 AM - 12:00 AM",
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/qahwat-alahsa-35297790.jpg"],
    description: "Traditional Al-Ahsa coffee house serving qahwa with fresh dates, karak tea, and local hospitality.",
    descriptionAr: "مقهى تراثي في الأحساء يقدم القهوة مع التمر الطازج وشاي الكرك والضيافة المحلية.",
    rating: 4.6,
  },
];

const mockEvents = [
  {
    title: "Al-Ahsa Date Festival",
    titleAr: "مهرجان تمور الأحساء",
    category: "festival" as const,
    date: "2024-10-15",
    time: "4:00 PM - 11:00 PM",
    location: "Al-Hofuf Date Palm Groves",
    locationAr: "بساتين نخيل الهفوف",
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/date-festival-0ae96b03.jpg"],
    description: "Annual celebration of Al-Ahsa's world-famous dates with tastings, traditional crafts, and cultural performances.",
    descriptionAr: "احتفال سنوي بتمور الأحساء المشهورة عالمياً مع التذوق والحرف التراثية والعروض الثقافية.",
  },
  {
    title: "Jabal Al-Qara Cave Exploration",
    titleAr: "استكشاف كهوف جبل القارة",
    category: "outdoor" as const,
    date: "2024-10-25",
    time: "8:00 AM - 5:00 PM",
    location: "Jabal Al-Qara Mountain",
    locationAr: "جبل القارة",
    images: ["https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/qara-caves-5a0f9843.jpg"],
    description: "Guided exploration of the famous Al-Qara caves with geological tours and traditional storytelling.",
    descriptionAr: "استكشاف موجه لكهوف القارة الشهيرة مع جولات جيولوجية وحكايات تراثية.",
  },
];

const featuredDestinations = [
  {
    name: "Al-Hofuf",
    nameAr: "الهفوف",
    subtitle: "Historic center",
    subtitleAr: "المركز التاريخي",
    category: "historical" as const,
    city: "Al-Hofuf",
    cityAr: "الهفوف",
    image: "https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/intercontinental-aea218dd.webp",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Jabal Al-Qara",
    nameAr: "جبل القارة",
    subtitle: "Mountain caves",
    subtitleAr: "الكهوف الجبلية",
    category: "natural" as const,
    city: "Al-Ahsa",
    cityAr: "الأحساء",
    image: "https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/qara-caves-5a0f9843.jpg",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Date Palm Groves",
    nameAr: "بساتين النخيل",
    subtitle: "UNESCO heritage",
    subtitleAr: "تراث اليونسكو",
    category: "natural" as const,
    city: "Al-Ahsa",
    cityAr: "الأحساء",
    image: "https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/date-festival-0ae96b03.jpg",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Ibrahim Palace",
    nameAr: "قصر إبراهيم",
    subtitle: "Ottoman fortress",
    subtitleAr: "القلعة العثمانية",
    category: "historical" as const,
    city: "Al-Hofuf",
    cityAr: "الهفوف",
    image: "https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/heritage-exhibition-4cab5a1c.jpg",
    featured: true,
    rating: 4.7,
  },
];

// Seed mutation - run this once to populate the database
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if database is already seeded
    const existingLodging = await ctx.db.query("lodgings").first();
    if (existingLodging) {
      return { message: "Database already seeded" };
    }

    let count = 0;

    // Seed lodgings
    for (const lodging of mockLodging) {
      await ctx.db.insert("lodgings", {
        ...lodging,
        status: "approved",
      });
      count++;
    }

    // Seed foods
    for (const food of mockFood) {
      await ctx.db.insert("foods", {
        ...food,
        status: "approved",
      });
      count++;
    }

    // Seed events
    for (const event of mockEvents) {
      await ctx.db.insert("events", {
        ...event,
        status: "approved",
      });
      count++;
    }

    // Seed destinations
    for (const dest of featuredDestinations) {
      await ctx.db.insert("destinations", {
        name: dest.name,
        nameAr: dest.nameAr,
        subtitle: dest.subtitle,
        subtitleAr: dest.subtitleAr,
        category: dest.category,
        city: dest.city,
        cityAr: dest.cityAr,
        images: [dest.image],
        featured: dest.featured,
        rating: dest.rating,
        status: "approved",
      });
      count++;
    }

    return { message: `Seeded ${count} records successfully` };
  },
});

// Clear all data (for development only)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Only allow in development
    const lodgings = await ctx.db.query("lodgings").collect();
    const foods = await ctx.db.query("foods").collect();
    const events = await ctx.db.query("events").collect();
    const destinations = await ctx.db.query("destinations").collect();

    let count = 0;

    for (const item of lodgings) {
      await ctx.db.delete(item._id);
      count++;
    }

    for (const item of foods) {
      await ctx.db.delete(item._id);
      count++;
    }

    for (const item of events) {
      await ctx.db.delete(item._id);
      count++;
    }

    for (const item of destinations) {
      await ctx.db.delete(item._id);
      count++;
    }

    return { message: `Cleared ${count} records` };
  },
});
