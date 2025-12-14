# HASIO - Complete Project Migration Guide

> Al-Ahsa Oasis Travel Guide App - Full Documentation for Migration

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [App Screens & Features](#app-screens--features)
3. [Design System](#design-system)
4. [All Content & Data](#all-content--data)
5. [Translations (English/Arabic)](#translations-englisharabic)
6. [Image Assets & URLs](#image-assets--urls)
7. [Data Types & Interfaces](#data-types--interfaces)
8. [Backend API Structure](#backend-api-structure)
9. [Tech Stack](#tech-stack)

---

## Project Overview

**App Name:** Hasio (هاسيو)
**Purpose:** Travel guide app for Al-Ahsa Oasis, Saudi Arabia
**Target:** iOS, Android, Web
**Languages:** English & Arabic (RTL support)

### Core Concept
A comprehensive travel companion for visitors to Al-Ahsa Oasis - the world's largest natural oasis and UNESCO World Heritage site. The app helps users discover lodging, food, events, plan trips, and capture memories.

### Key Features
- Multi-language support (English/Arabic with RTL)
- 7-tab navigation (Home, Lodging, Food, Events, Planner, Moments, Settings)
- AI-powered trip planning assistant
- Photo memories gallery
- Favorites system
- OAuth authentication (Google/Apple)
- Offline-first with local storage

---

## App Screens & Features

### 1. Onboarding Screen
**Purpose:** Language selection and authentication

**Flow:**
1. Welcome screen with Al-Ahsa imagery
2. Language selection (English/Arabic)
3. Authentication options:
   - Continue with Google
   - Continue with Apple
   - Skip for guest access

**Content:**
- Hero text: "Ahlan wa Sahlan fi Al-Ahsa" (أهلاً وسهلاً في الأحساء)
- Subtitle: "Experience the world's largest natural oasis and UNESCO World Heritage site"

---

### 2. Home Screen
**Purpose:** Main discovery hub

**Sections:**
1. **Greeting Header** - Dynamic based on time:
   - Morning (5am-12pm): "Good Morning" / "صباح الخير"
   - Afternoon (12pm-6pm): "Good Afternoon" / "مساء الخير"
   - Evening (6pm-5am): "Good Evening" / "مساء الخير"

2. **Search Bar** - "Search places in Al-Ahsa Oasis..."

3. **Category Cards** (3 cards):
   | Category | English Title | Arabic Title |
   |----------|--------------|--------------|
   | Lodging | Discover Al-Ahsa Hospitality | ضيافة الأحساء |
   | Food | Taste Al-Ahsa Authentic Cuisine | تذوق مأكولات الأحساء الأصيلة |
   | Events | Experience Al-Ahsa Culture | اختبر ثقافة الأحساء |

4. **Featured Destinations Carousel**:
   - Al-Hofuf (Historic center)
   - Jabal Al-Qara (Mountain caves)
   - Al-Uqair (Historic port)

---

### 3. Lodging Screen
**Purpose:** Browse and filter lodging options

**Filter Categories:**
| Filter | English | Arabic |
|--------|---------|--------|
| All | All | الكل |
| Hotels | Hotels | الفنادق |
| Apartments | Apartments | الشقق |
| Camps | Camps | المخيمات |
| Homestays | Homestays | استضافة شعبية |

**Card Display:**
- Property image with rating badge
- Favorite heart button
- Property name
- Type badge (colored by category)
- Location with neighborhood
- Price range per night

---

### 4. Food Screen
**Purpose:** Browse restaurants and food establishments

**Filter Categories:**
| Filter | English | Arabic |
|--------|---------|--------|
| All | All | الكل |
| Restaurants | Restaurants | المطاعم |
| Productive Families | Productive Families | الأسر المنتجة |
| Fast Food | Fast Food | الوجبات السريعة |
| Drinks | Drinks | المشروبات |

**Card Display:**
- Food image with rating
- Category badge
- Restaurant name
- Cuisine type
- Operating hours
- Average price

---

### 5. Events Screen
**Purpose:** Browse events and activities

**Filter Categories:**
| Filter | English | Arabic |
|--------|---------|--------|
| All | All | الكل |
| Festivals | Festivals | المهرجانات |
| Conferences | Conferences | المؤتمرات |
| Outdoor | Outdoor | خارجية |
| Indoor | Indoor | داخلية |
| Seasonal | Seasonal | موسمية |

**Card Display:**
- Event image
- Category badge
- Event title
- Date (localized format)
- Time
- Location

---

### 6. Planner Screen (AI Assistant)
**Purpose:** AI-powered trip planning

**Welcome Message:**
- English: "Marhaba! I'm here to help you plan the perfect day in Al-Ahsa Oasis. What would you like to explore today?"
- Arabic: "مرحباً! أنا هنا لمساعدتك في التخطيط ليوم مثالي في الأحساء. ماذا تريد أن تستكشف اليوم؟"

**Quick Suggestion Buttons:**
| Button | English | Arabic | Action |
|--------|---------|--------|--------|
| Lodging | Find a place to stay | ابحث عن مكان للإقامة | Navigate to Lodging |
| Food | Discover local cuisine | اكتشف المأكولات المحلية | Navigate to Food |
| Events | Explore events & activities | استكشف الفعاليات والأنشطة | Navigate to Events |
| Itinerary | Plan a full day itinerary | خطط ليوم كامل | Chat response |

**Chat Interface:**
- User messages (right-aligned, primary color)
- Bot messages (left-aligned, surface color)
- Input placeholder: "Ask me anything about your trip..."

---

### 7. Moments Screen
**Purpose:** Photo gallery of travel memories

**Features:**
- 2-column grid layout
- Moment cards showing:
  - Image with date overlay
  - Note text
  - Location (optional)
- Add button in header
- Empty state with call-to-action

**Empty State:**
- Title: "No memories yet" / "لا توجد ذكريات"
- Message: "Capture your first travel moment!" / "احفظ ذكريات رحلتك الأولى!"

---

### 8. Settings Screen
**Purpose:** User preferences and account management

**Sections:**

**1. Preferences**
| Setting | English | Arabic |
|---------|---------|--------|
| Language | Language | اللغة |
| Notifications | Notifications | الإشعارات |
| Dark Mode | Dark Mode | الوضع الليلي |

**2. Account**
| Setting | English | Arabic | Subtitle |
|---------|---------|--------|----------|
| Profile | Profile | الملف الشخصي | Manage your profile |
| Favorites | Favorites | المفضلة | Your saved places |
| Privacy | Privacy & Security | الخصوصية والأمان | Manage your data |
| Sign Out | Sign Out | تسجيل الخروج | Sign out of your account |

**3. Support**
| Setting | English | Arabic | Subtitle |
|---------|---------|--------|----------|
| Rate App | Rate App | قيم التطبيق | Share your feedback |
| About | About | حول التطبيق | App version and info |

**App Info:**
- Name: Hasio / هاسيو
- Version: 1.0.0
- Description: "Your perfect travel companion for discovering amazing places, delicious food, and unforgettable experiences in Al-Ahsa Oasis."

---

### 9. Add Moment Modal
**Purpose:** Capture travel memories

**Fields:**
- Image picker (1:1 aspect ratio)
- Note textarea: "Write a note..." / "اكتب ملاحظة..."
- Location input: "Add Location" / "إضافة موقع"

---

## Design System

### Color Palette

```
PRIMARY COLORS (Deep Teal)
primary:        #0D7A5F
primaryHover:   #0F8B6E
primaryLight:   #10966D
primaryDark:    #0A6650

ACCENT COLORS
accent:         #2563EB (Blue)
accentLight:    #3B82F6
attention:      #DC6B5A (Coral)
secondary:      #7C3AED (Purple)
secondaryDark:  #6D28D9

BACKGROUNDS
background:     #FAF7F2 (Warm white)
surface:        #FFFFFF
surfaceVariant: #F5F1EB
surfaceElevated:#FFFFFF

TEXT COLORS
onSurface:      #1A1A1A (Dark)
onSurfaceVariant: #737373 (Medium gray)
onSurfaceMuted: #A3A3A3 (Light gray)

BORDERS
border:         #E8E5E0
divider:        #F0EDE8

SYSTEM COLORS
success:        #0D7A5F (Teal)
error:          #DC6B5A (Coral)
warning:        #D97706 (Amber)
info:           #2563EB (Blue)
gold:           #D97706 (For ratings)

SHADOWS
light:          rgba(0, 0, 0, 0.04)
medium:         rgba(0, 0, 0, 0.08)
heavy:          rgba(0, 0, 0, 0.12)

OVERLAYS
light:          rgba(0, 0, 0, 0.3)
medium:         rgba(0, 0, 0, 0.5)
heavy:          rgba(0, 0, 0, 0.7)

GLASS EFFECT
background:     rgba(255, 255, 255, 0.85)
border:         rgba(255, 255, 255, 0.2)

GRADIENTS
primaryGradient: ['#0D7A5F', '#10966D']
accentGradient:  ['#2563EB', '#3B82F6']
heroGradient:    ['#0D7A5F', '#0F8B6E']
surfaceGradient: ['#FFFFFF', '#FAF7F2']
```

### Category Badge Colors
| Type | Color |
|------|-------|
| Hotel | Primary (#0D7A5F) |
| Apartment | Accent (#2563EB) |
| Camp | Attention (#DC6B5A) |
| Homestay | Secondary (#7C3AED) |
| Restaurant | Accent (#2563EB) |
| Home Kitchen | Attention (#DC6B5A) |
| Fast Food | Primary (#0D7A5F) |
| Drinks | Gold (#D97706) |

### Design Guidelines
- Never use icons in design
- Never use colored icons in UI
- Use text-based navigation
- Minimal, clean aesthetic
- Warm color palette reflecting oasis theme

---

## All Content & Data

### LODGING DATA (9 Properties)

#### 1. Al-Ahsa InterContinental
```
Type: Hotel
Location: Al-Hofuf, Al-Ahsa
Price: 450-650 SAR/night
Rating: 4.7
Amenities: Wi-Fi, Pool, Spa, Date Palm Gardens, Traditional Dining, Prayer Room
Description (EN): Luxury hotel in the heart of Al-Ahsa Oasis with views of ancient date palm groves and traditional architecture.
Description (AR): فندق فاخر في قلب واحة الأحساء مع إطلالات على بساتين النخيل القديمة والعمارة التراثية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/intercontinental-aea218dd.webp
```

#### 2. Kayan Al Bustan Apartments
```
Type: Apartment
Location: Al-hafouf, Al-Ahsa
Price: 300-450 SAR/night
Rating: 4.8
Amenities: Wi-Fi, Traditional Kitchen, Parking, Mountain Views, Prayer Room, Date Garden Access
Description (EN): Authentic Al-Ahsa apartment
Description (AR): شقة أصيلة في الأحساء بالقرب من كهوف جبل القارة مع العمارة الحساوية التراثية وإطلالات الواحة.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/kayan-apartments-f7de2915.jpg
```

#### 3. Al-Ahsa Desert Camp
```
Type: Camp
Location: Eastern Desert, Al-Ahsa
Price: 800-1200 SAR/night
Rating: 4.9
Amenities: Traditional Meals, Camel Rides, Falconry, Stargazing, Bedouin Stories, Date Harvesting
Description (EN): Authentic desert experience on the edge of Al-Ahsa Oasis with traditional Bedouin hospitality and date palm excursions.
Description (AR): تجربة صحراوية أصيلة على حافة واحة الأحساء مع الضيافة البدوية التراثية ورحلات بساتين النخيل.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/desert-camp-a2dc07bf.jpg
```

#### 4. Lily Palms Hotel
```
Type: Hotel
Location: Al-Hofuf Center, Al-Ahsa
Price: 350-500 SAR/night
Rating: 4.5
Amenities: Wi-Fi, Oasis Views, Pool, Traditional Restaurant, Prayer Room, Spa
Description (EN): Central hotel in Al-Hofuf with easy access to traditional souks and UNESCO World Heritage sites.
Description (AR): فندق مركزي في الهفوف مع سهولة الوصول إلى الأسواق التراثية ومواقع التراث العالمي لليونسكو.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/lily-palms-0c1226df.webp
```

#### 5. Reef Resort Alahsa
```
Type: Hotel
Location: Al-Hofuf, Al-Ahsa
Price: 600-900 SAR/night
Rating: 4.6
Amenities: Beach Access, Water Sports, Spa, Seafood Restaurant, Historical Fort Views
Description (EN): Beach resort near Al-Uqair historic port
Description (AR): منتجع ساحلي بالقرب من ميناء العقير التاريخي مع إطلالات الخليج العربي وسحر قرية الصيد التراثية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/reef-resort-cec7f980.jpg
```

#### 6. Al-Ahsa Eco Lodge
```
Type: Hotel
Location: Date Palm Groves, Al-Ahsa
Price: 400-600 SAR/night
Rating: 4.8
Amenities: Eco-Friendly, Date Palm Tours, Traditional Crafts, Organic Dining, Natural Springs
Description (EN): Sustainable lodge immersed in the world's largest oasis with authentic agricultural experiences and natural hot springs.
Description (AR): نزل مستدام منغمس في أكبر واحة في العالم مع تجارب زراعية أصيلة وينابيع ساخنة طبيعية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/eco-lodge-26100bb0.jpg
```

#### 7. Homestay 1
```
Type: Homestay
Location: Old Al-Hofuf, Al-Ahsa
Price: 250-350 SAR/night
Rating: 4.9
Amenities: Traditional Breakfast, Arabic Coffee, Cultural Stories, Date Farm Tour, Traditional Cooking Class, Prayer Room
Description (EN): Experience authentic Hasawi hospitality in a traditional family home with home-cooked meals and cultural experiences.
Description (AR): اختبر الضيافة الحساوية الأصيلة في بيت عائلي تقليدي مع وجبات منزلية وتجارب ثقافية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/homestay-1-069492f0.jpg
```

#### 8. Homestay 2
```
Type: Homestay
Location: Al-Mubarraz, Al-Ahsa
Price: 200-300 SAR/night
Rating: 4.8
Amenities: Family Dining, Local Guide, Traditional Crafts, Garden, Wi-Fi, Majlis Room
Description (EN): Warm family welcome in the heart of Al-Ahsa with traditional meals and guided tours to hidden local treasures.
Description (AR): ترحيب عائلي دافئ في قلب الأحساء مع وجبات تقليدية وجولات موجهة إلى الكنوز المحلية المخفية.
Image: https://www.researchgate.net/publication/265702212/figure/fig2/AS:392123418464260@1470500916491/A-typical-example-of-a-Saudi-villa-2012.png
```

#### 9. Homestay 3
```
Type: Homestay
Location: Date Palm Groves, Al-Ahsa
Price: 300-400 SAR/night
Rating: 5.0
Amenities: Date Harvesting Experience, Traditional Oven, Storytelling Sessions, Organic Garden, Traditional Games, Falaj System Tour
Description (EN): Historic family home in the date palm groves offering immersive cultural experiences and traditional Hasawi lifestyle.
Description (AR): بيت عائلي تاريخي في بساتين النخيل يقدم تجارب ثقافية غامرة ونمط الحياة الحساوي التقليدي.
Image: https://cbc.com.sa/wp-content/uploads/2023/03/%D9%85%D8%AC%D9%85%D8%B9-11-%D9%81%D9%84%D9%84-2-scaled.webp
```

---

### FOOD DATA (8 Establishments)

#### 1. Al-Ahsa Traditional Restaurant
```
Category: Restaurant
Cuisine: Hasawi Traditional
Price: 80-150 SAR
Hours: 12:00 PM - 11:00 PM
Rating: 4.8
Description (EN): Authentic Hasawi cuisine featuring date-stuffed lamb, traditional rice dishes, and fresh seafood from Al-Uqair.
Description (AR): مأكولات حساوية أصيلة تتميز بالخروف المحشو بالتمر وأطباق الأرز التراثية والمأكولات البحرية الطازجة من العقير.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/traditional-restaurant-7f7a7b7f.webp
```

#### 2. Sultanah Kitchen (Productive Family)
```
Category: Home Kitchen
Cuisine: Home-style Hasawi
Price: 40-80 SAR
Hours: 5:00 PM - 10:00 PM
Rating: 4.9
Description (EN): Traditional Hasawi dishes prepared by local productive families, featuring date-based sweets and oasis vegetables.
Description (AR): أطباق حساوية تراثية محضرة من قبل الأسر المنتجة المحلية، تتميز بالحلويات المعتمدة على التمر وخضروات الواحة.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/sultanah-kitchen-78cc88d7.jpg
```

#### 3. Al-Hofuf Dates & Sweets
```
Category: Fast Food
Cuisine: Traditional Sweets
Price: 20-45 SAR
Hours: 8:00 AM - 11:00 PM
Rating: 4.7
Description (EN): Famous for Al-Ahsa dates, traditional sweets, and quick Hasawi snacks in the heart of Al-Hofuf.
Description (AR): مشهور بتمور الأحساء والحلويات التراثية والوجبات الحساوية السريعة في قلب الهفوف.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/dates-sweets-83cdc6f1.jpg
```

#### 4. Qahwat Al-Ahsa
```
Category: Drinks
Cuisine: Traditional Beverages
Price: 15-35 SAR
Hours: 5:00 AM - 12:00 AM
Rating: 4.6
Description (EN): Traditional Al-Ahsa coffee house serving qahwa with fresh dates, karak tea, and local hospitality.
Description (AR): مقهى تراثي في الأحساء يقدم القهوة مع التمر الطازج وشاي الكرك والضيافة المحلية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/qahwat-alahsa-35297790.jpg
```

#### 5. Al-Uqair Seafood House
```
Category: Restaurant
Cuisine: Fresh Seafood
Price: 100-180 SAR
Hours: 12:00 PM - 11:00 PM
Rating: 4.7
Description (EN): Fresh Arabian Gulf seafood from Al-Uqair port, featuring grilled hammour, shrimp, and traditional fish curry.
Description (AR): مأكولات بحرية طازجة من الخليج العربي من ميناء العقير، تتميز بالهامور المشوي والروبيان وكاري السمك التراثي.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/uqair-seafood-d2798dbc.jpg
```

#### 6. Al-Ahsa Date Farm Cafe
```
Category: Drinks
Cuisine: Natural Products
Price: 25-60 SAR
Hours: 7:00 AM - 10:00 PM
Rating: 4.8
Description (EN): Premium Al-Ahsa dates, fresh date juice, traditional date sweets, and organic oasis produce.
Description (AR): تمور الأحساء الممتازة وعصير التمر الطازج وحلويات التمر التراثية والمنتجات العضوية من الواحة.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/date-farm-cafe-b3a1e58d.jpg
```

#### 7. Bait Al-Tamr Family Kitchen
```
Category: Home Kitchen
Cuisine: Productive Family
Price: 35-70 SAR
Hours: 4:00 PM - 9:00 PM
Rating: 4.9
Description (EN): Award-winning productive family specializing in date-based dishes, traditional bread, and Hasawi pickles.
Description (AR): أسرة منتجة حائزة على جوائز متخصصة في الأطباق المعتمدة على التمر والخبز التراثي ومخللات الأحساء.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/bait-altamr-235e47e8.jpg
```

#### 8. Al-Qara Mountain Restaurant
```
Category: Restaurant
Cuisine: Mountain Cuisine
Price: 60-120 SAR
Hours: 11:00 AM - 10:00 PM
Rating: 4.5
Description (EN): Unique dining experience near Jabal Al-Qara with cave-aged specialties and panoramic oasis views.
Description (AR): تجربة طعام فريدة بالقرب من جبل القارة مع أطباق معتقة في الكهوف وإطلالات بانورامية على الواحة.
Image: https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqYp8-wTtKdHiMhcAXpO3_AOoiPrcnu_kHWMCfCBTTYwuhJ4DJ0aC6wCadxUfMPHYR5veurZiM8ys0MITaiokZi-KOZjdILXVWJYB_A6aIrhs_h1G4ZGWpE0xfp01JScr-Kj3XgNw=s680-w680-h510-rw
```

---

### EVENTS DATA (8 Events)

#### 1. Al-Ahsa Date Festival
```
Category: Festival
Date: October 15, 2024
Time: 4:00 PM - 11:00 PM
Location: Al-Hofuf Date Palm Groves
Description (EN): Annual celebration of Al-Ahsa's world-famous dates with tastings, traditional crafts, and cultural performances.
Description (AR): احتفال سنوي بتمور الأحساء المشهورة عالمياً مع التذوق والحرف التراثية والعروض الثقافية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/date-festival-0ae96b03.jpg
```

#### 2. UNESCO Oasis Heritage Conference
```
Category: Conference
Date: November 20, 2024
Time: 9:00 AM - 6:00 PM
Location: Al-Ahsa Cultural Center
Description (EN): International conference on oasis conservation and sustainable agriculture in UNESCO World Heritage sites.
Description (AR): مؤتمر دولي حول حفظ الواحات والزراعة المستدامة في مواقع التراث العالمي لليونسكو.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/unesco-conference-3f1eea82.jpg
```

#### 3. Jabal Al-Qara Cave Exploration
```
Category: Outdoor
Date: October 25, 2024
Time: 8:00 AM - 5:00 PM
Location: Jabal Al-Qara Mountain
Description (EN): Guided exploration of the famous Al-Qara caves with geological tours and traditional storytelling.
Description (AR): استكشاف موجه لكهوف القارة الشهيرة مع جولات جيولوجية وحكايات تراثية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/qara-caves-5a0f9843.jpg
```

#### 4. Al-Ahsa Heritage Exhibition
```
Category: Indoor
Date: November 10, 2024
Time: 10:00 AM - 9:00 PM
Location: Ibrahim Palace Museum
Description (EN): Discover Al-Ahsa's rich history through artifacts, traditional crafts, and interactive displays at the historic palace.
Description (AR): اكتشف تاريخ الأحساء الغني من خلال القطع الأثرية والحرف التراثية والعروض التفاعلية في القصر التاريخي.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/heritage-exhibition-4cab5a1c.jpg
```

#### 5. Al-Uqair Fishing Festival
```
Category: Outdoor
Date: December 5, 2024
Time: 5:00 AM - 8:00 PM
Location: Al-Uqair Historic Port
Description (EN): Traditional fishing competition and seafood festival at the historic Al-Uqair port on the Arabian Gulf.
Description (AR): مسابقة صيد تراثية ومهرجان مأكولات بحرية في ميناء العقير التاريخي على الخليج العربي.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/fishing-festival-a6fafe72.jpg
```

#### 6. Al-Ahsa Traditional Crafts Fair
```
Category: Festival
Date: December 15, 2024
Time: 3:00 PM - 10:00 PM
Location: Al-Hofuf Traditional Souq
Description (EN): Traditional Hasawi crafts fair featuring pottery, weaving, date products, and local artisan demonstrations.
Description (AR): معرض الحرف الحساوية التراثية يتميز بالفخار والنسيج ومنتجات التمر وعروض الحرفيين المحليين.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/crafts-fair-ed9a6bc9.jpg
```

#### 7. Al-Ahsa Oasis Photography Workshop
```
Category: Outdoor
Date: November 30, 2024
Time: 6:00 AM - 6:00 PM
Location: Various Oasis Locations
Description (EN): Professional photography workshop capturing the beauty of the world's largest oasis during golden hour.
Description (AR): ورشة تصوير احترافية لالتقاط جمال أكبر واحة في العالم خلال الساعة الذهبية.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/photography-workshop-2af4a19b.jpg
```

#### 8. Al-Ahsa Agricultural Innovation Summit
```
Category: Conference
Date: December 20, 2024
Time: 8:00 AM - 5:00 PM
Location: King Faisal University
Description (EN): International summit on sustainable oasis agriculture and modern farming techniques in arid environments.
Description (AR): قمة دولية حول الزراعة المستدامة في الواحات وتقنيات الزراعة الحديثة في البيئات القاحلة.
Image: https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/agriculture-summit-1fba0de8.jpg
```

---

### SAMPLE USER PROFILE
```
Name: ابو عزوز
Email: abuazzouz@example.com
Phone: +966 50 123 4567
```

---

## Translations (English/Arabic)

### Complete Translation Keys

```javascript
// ONBOARDING
welcome: 'Welcome to Al-Ahsa Oasis' / 'أهلاً وسهلاً بك في الأحساء'
welcomeSubtitle: 'Discover the Pearl of the Eastern Province' / 'اكتشف لؤلؤة المنطقة الشرقية'
heroGreeting: 'Ahlan wa Sahlan fi Al-Ahsa' / 'أهلاً وسهلاً في الأحساء'
heroSubtext: 'Experience the world\'s largest natural oasis and UNESCO World Heritage site' / 'أكبر واحة طبيعية في العالم وموقع التراث العالمي'
selectLanguage: 'Select Language' / 'اختر اللغة'
english: 'English' / 'English'
arabic: 'العربية' / 'العربية'
continue: 'Continue' / 'متابعة'
skip: 'Skip for now' / 'تخطي'
phoneEmail: 'Phone or Email' / 'الهاتف أو البريد الإلكتروني'
signIn: 'Sign In' / 'تسجيل الدخول'
signUp: 'Sign Up' / 'إنشاء حساب'
continueWithGoogle: 'Continue with Google' / 'المتابعة مع جوجل'
continueWithApple: 'Continue with Apple' / 'المتابعة مع أبل'
signOut: 'Sign Out' / 'تسجيل الخروج'
signOutSubtitle: 'Sign out of your account' / 'الخروج من حسابك'
signInSubtitle: 'Sign in to save your data' / 'سجل الدخول لحفظ بياناتك'
guest: 'Guest' / 'ضيف'
authError: 'Authentication failed. Please try again.' / 'فشل المصادقة. يرجى المحاولة مرة أخرى.'
authSuccess: 'Successfully signed in!' / 'تم تسجيل الدخول بنجاح!'

// NAVIGATION
home: 'Home' / 'الرئيسية'
lodging: 'Lodging' / 'الإقامة'
food: 'Food & Drinks' / 'الطعام والمشروبات'
events: 'Events' / 'الفعاليات'
planner: 'Planner' / 'المخطط'
moments: 'Moments' / 'اللحظات'
settings: 'Settings' / 'الإعدادات'

// HOME
searchPlaceholder: 'Search places in Al-Ahsa Oasis...' / 'البحث عن أماكن في واحة الأحساء...'
discoverLodging: 'Discover Al-Ahsa Hospitality' / 'ضيافة الأحساء'
exploreFoodDrinks: 'Taste Al-Ahsa Authentic Cuisine' / 'تذوق مأكولات الأحساء الأصيلة'
findEvents: 'Experience Al-Ahsa Culture' / 'اختبر ثقافة الأحساء'
morningGreeting: 'Good Morning' / 'صباح الخير'
afternoonGreeting: 'Good Afternoon' / 'مساء الخير'
eveningGreeting: 'Good Evening' / 'مساء الخير'
exploreOasis: 'Explore the Oasis' / 'استكشف الأحساء'

// LODGING
hotels: 'Hotels' / 'الفنادق'
apartments: 'Apartments' / 'الشقق'
camps: 'Camps' / 'المخيمات'
homestays: 'Homestays' / 'استضافة شعبية'
amenities: 'Amenities' / 'المرافق'
addToFavorites: 'Add to Favorites' / 'إضافة للمفضلة'
removeFromFavorites: 'Remove from Favorites' / 'إزالة من المفضلة'

// FOOD
restaurants: 'Restaurants' / 'المطاعم'
productiveFamilies: 'Productive Families' / 'الأسر المنتجة'
fastFood: 'Fast Food' / 'الوجبات السريعة'
drinks: 'Drinks' / 'المشروبات'
callRestaurant: 'Call Restaurant' / 'اتصل بالمطعم'
getDirections: 'Get Directions' / 'احصل على الاتجاهات'

// EVENTS
festivals: 'Festivals' / 'المهرجانات'
conferences: 'Conferences' / 'المؤتمرات'
outdoor: 'Outdoor' / 'خارجية'
indoor: 'Indoor' / 'داخلية'
seasonal: 'Seasonal' / 'موسمية'
addToPlan: 'Add to Plan' / 'إضافة للمخطط'

// PLANNER
myPlan: 'My Day Plan' / 'مخططي اليومي'
addPlanItem: 'Add Plan Item' / 'إضافة عنصر للمخطط'
editPlanItem: 'Edit Plan Item' / 'تعديل عنصر المخطط'
selectTime: 'Select Time' / 'اختر الوقت'
addNote: 'Add Note' / 'إضافة ملاحظة'
save: 'Save' / 'حفظ'
delete: 'Delete' / 'حذف'
plannerAssistant: 'Your Travel Assistant' / 'مساعدك السياحي'
plannerWelcome: 'Marhaba!' / 'مرحباً!'
plannerGreeting: 'I\'m here to help you plan the perfect day in Al-Ahsa Oasis. What would you like to explore today?' / 'أنا هنا لمساعدتك في التخطيط ليوم مثالي في الأحساء. ماذا تريد أن تستكشف اليوم؟'
suggestLodging: 'Find a place to stay' / 'ابحث عن مكان للإقامة'
suggestFood: 'Discover local cuisine' / 'اكتشف المأكولات المحلية'
suggestEvents: 'Explore events & activities' / 'استكشف الفعاليات والأنشطة'
suggestItinerary: 'Plan a full day itinerary' / 'خطط ليوم كامل'
chatPlaceholder: 'Ask me anything about your trip...' / 'اسألني أي شيء عن رحلتك...'
sendMessage: 'Send' / 'إرسال'

// MOMENTS
myMoments: 'My Moments' / 'لحظاتي'
addMoment: 'Add Moment' / 'إضافة لحظة'
selectPhoto: 'Select Photo' / 'اختر صورة'
addLocation: 'Add Location' / 'إضافة موقع'
writeNote: 'Write a note...' / 'اكتب ملاحظة...'

// SETTINGS
language: 'Language' / 'اللغة'
notifications: 'Notifications' / 'الإشعارات'
profile: 'Profile' / 'الملف الشخصي'
about: 'About' / 'حول التطبيق'
preferences: 'Preferences' / 'التفضيلات'
account: 'Account' / 'الحساب'
support: 'Support' / 'الدعم'
darkMode: 'Dark Mode' / 'الوضع الليلي'
enabled: 'Enabled' / 'مفعل'
disabled: 'Disabled' / 'معطل'
manageProfile: 'Manage your profile' / 'إدارة ملفك الشخصي'
favorites: 'Favorites' / 'المفضلة'
savedPlaces: 'Your saved places' / 'أماكنك المحفوظة'
privacySecurity: 'Privacy & Security' / 'الخصوصية والأمان'
manageData: 'Manage your data' / 'إدارة بياناتك'
rateApp: 'Rate App' / 'قيم التطبيق'
sharefeedback: 'Share your feedback' / 'شارك رأيك'
appVersionInfo: 'App version and info' / 'إصدار التطبيق والمعلومات'
premiumMember: 'Premium Member' / 'عضو مميز'
appName: 'Hasio' / 'هاسيو'
version: 'Version 1.0.0' / 'الإصدار 1.0.0'
appDescription: 'Your perfect travel companion for discovering amazing places, delicious food, and unforgettable experiences in Al-Ahsa Oasis.' / 'رفيقك المثالي للسفر لاكتشاف الأماكن الرائعة والطعام اللذيذ والتجارب التي لا تُنسى في الأحساء.'

// COMMON
search: 'Search' / 'بحث'
filter: 'Filter' / 'تصفية'
rating: 'Rating' / 'التقييم'
price: 'Price' / 'السعر'
city: 'City' / 'المدينة'
type: 'Type' / 'النوع'
date: 'Date' / 'التاريخ'
time: 'Time' / 'الوقت'
location: 'Location' / 'الموقع'
description: 'Description' / 'الوصف'
cancel: 'Cancel' / 'إلغاء'
done: 'Done' / 'تم'
loading: 'Loading...' / 'جاري التحميل...'
noResults: 'No results found' / 'لا توجد نتائج'
error: 'Something went wrong' / 'حدث خطأ ما'
retry: 'Retry' / 'إعادة المحاولة'
all: 'All' / 'الكل'
perNight: 'per night' / 'في الليلة'
averagePrice: 'average price' / 'متوسط السعر'

// EMPTY STATES
emptyLodgingTitle: 'No lodging found' / 'لا توجد نتائج'
emptyLodgingMessage: 'Try adjusting your filters' / 'جرب تغيير الفلتر'
emptyFoodTitle: 'No restaurants found' / 'لا توجد مطاعم'
emptyFoodMessage: 'Try a different category' / 'جرب فئة مختلفة'
emptyEventsTitle: 'No events available' / 'لا توجد فعاليات'
emptyEventsMessage: 'Check back later for upcoming events' / 'تحقق لاحقاً من الفعاليات القادمة'
emptyMomentsTitle: 'No memories yet' / 'لا توجد ذكريات'
emptyMomentsMessage: 'Capture your first travel moment!' / 'احفظ ذكريات رحلتك الأولى!'
emptyMomentsAction: 'Add Moment' / 'إضافة ذكرى'
emptyPlannerTitle: 'No plans yet' / 'لا توجد خطط'
emptyPlannerMessage: 'Start planning your Al-Ahsa adventure' / 'ابدأ التخطيط لمغامرتك في الأحساء'

// ERROR MESSAGES
errorGeneric: 'Something went wrong' / 'حدث خطأ ما'
errorNetwork: 'Please check your internet connection' / 'يرجى التحقق من اتصال الإنترنت'
errorSaveFailed: 'Failed to save. Please try again.' / 'فشل الحفظ. يرجى المحاولة مرة أخرى.'
errorLoadFailed: 'Failed to load. Please try again.' / 'فشل التحميل. يرجى المحاولة مرة أخرى.'
errorDeleteFailed: 'Failed to delete. Please try again.' / 'فشل الحذف. يرجى المحاولة مرة أخرى.'

// TOAST MESSAGES
toastSaved: 'Saved successfully' / 'تم الحفظ بنجاح'
toastDeleted: 'Deleted successfully' / 'تم الحذف بنجاح'
toastAddedToFavorites: 'Added to favorites' / 'تمت الإضافة للمفضلة'
toastRemovedFromFavorites: 'Removed from favorites' / 'تمت الإزالة من المفضلة'
toastMomentSaved: 'Moment saved!' / 'تم حفظ الذكرى!'
toastPlanSaved: 'Plan saved!' / 'تم حفظ الخطة!'

// ADDITIONAL
discoverAmazingPlaces: 'Discover amazing places to stay in Al-Ahsa' / 'اكتشف أماكن رائعة للإقامة في الأحساء'
homestayWelcome: 'Experience authentic Hasawi hospitality' / 'اختبر الضيافة الحساوية الأصيلة'
stayWithLocals: 'Stay with local families' / 'أقم مع العائلات المحلية'
authenticExperience: 'Authentic cultural experience' / 'تجربة ثقافية أصيلة'
homeCooked: 'Home-cooked traditional meals' / 'وجبات تقليدية منزلية'
localKnowledge: 'Local knowledge & stories' / 'معرفة محلية وقصص'
tasteAuthenticFlavors: 'Taste the authentic flavors of Al-Ahsa' / 'تذوق النكهات الأصيلة للأحساء'
discoverEventsActivities: 'Discover Al-Ahsa events and activities' / 'استكشف فعاليات وأنشطة الأحساء'
```

---

## Image Assets & URLs

### App Icons (Local)
```
assets/images/icon.png           - App icon
assets/images/splash-icon.png    - Splash screen
assets/images/adaptive-icon.png  - Android adaptive icon
assets/images/favicon.png        - Web favicon
```

### Content Images (Remote - R2 Storage)

**Lodging:**
```
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/intercontinental-aea218dd.webp
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/kayan-apartments-f7de2915.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/desert-camp-a2dc07bf.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/lily-palms-0c1226df.webp
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/reef-resort-cec7f980.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/eco-lodge-26100bb0.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/homestay-1-069492f0.jpg
```

**Food:**
```
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/traditional-restaurant-7f7a7b7f.webp
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/sultanah-kitchen-78cc88d7.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/dates-sweets-83cdc6f1.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/qahwat-alahsa-35297790.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/uqair-seafood-d2798dbc.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/date-farm-cafe-b3a1e58d.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/bait-altamr-235e47e8.jpg
```

**Events:**
```
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/date-festival-0ae96b03.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/unesco-conference-3f1eea82.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/qara-caves-5a0f9843.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/heritage-exhibition-4cab5a1c.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/fishing-festival-a6fafe72.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/crafts-fair-ed9a6bc9.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/photography-workshop-2af4a19b.jpg
https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/agriculture-summit-1fba0de8.jpg
```

---

## Data Types & Interfaces

```typescript
// LODGING
interface Lodging {
  id: string;
  name: string;
  type: 'hotel' | 'apartment' | 'camp' | 'homestay';
  city: string;
  neighborhood: string;
  priceRange: string;
  rating: number;
  images: string[];
  amenities: string[];
  description: string;
}

// FOOD
interface Food {
  id: string;
  name: string;
  category: 'restaurant' | 'home_kitchen' | 'fastfood' | 'drinks';
  cuisine: string;
  avgPrice: string;
  hours: string;
  images: string[];
  description: string;
  rating: number;
}

// EVENT
interface Event {
  id: string;
  title: string;
  category: 'festival' | 'conference' | 'outdoor' | 'indoor' | 'seasonal';
  date: string;
  time: string;
  location: string;
  images: string[];
  description: string;
}

// PLAN ITEM
interface PlanItem {
  id: string;
  time: string;
  type: 'lodging' | 'food' | 'event';
  refId: string;
  note: string;
}

// DAY PLAN
interface DayPlan {
  id: string;
  date: string;
  items: PlanItem[];
}

// MOMENT
interface Moment {
  id: string;
  image: string;
  note: string;
  location?: string;
  timestamp: string;
}

// USER
interface User {
  name: string;
  email: string;
  phone: string;
}

// AUTH USER
interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

// AUTH STATE
interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthUser | null;
}

// LANGUAGE
type Language = 'en' | 'ar';
```

---

## Backend API Structure

### Endpoints

**Public Routes:**
```
GET  /api/lodging              - List lodging with filters
GET  /api/lodging/:id          - Get single lodging
GET  /api/food                 - List food with filters
GET  /api/food/:id             - Get single food item
GET  /api/events               - List events with filters
GET  /api/events/:id           - Get single event
GET  /health                   - Health check
```

**Protected Routes (Auth Required):**
```
GET    /api/user/favorites     - Get user favorites
POST   /api/user/favorites     - Add favorite
DELETE /api/user/favorites/:id - Remove favorite

GET    /api/user/plans         - Get user plans
POST   /api/user/plans         - Create plan
PUT    /api/user/plans/:id     - Update plan
DELETE /api/user/plans/:id     - Delete plan

GET    /api/user/moments       - Get user moments
POST   /api/user/moments       - Create moment
DELETE /api/user/moments/:id   - Delete moment

POST   /api/upload/moment      - Upload moment image
POST   /api/upload/content/:type - Upload content image
DELETE /api/upload/:key        - Delete uploaded file
```

### Query Parameters
```
// Lodging
?type=hotel|apartment|camp|homestay
?city=Al-Ahsa
?minRating=4.5
?limit=10
?offset=0
?lang=en|ar

// Food
?category=restaurant|home_kitchen|fastfood|drinks
?cuisine=Hasawi
?limit=10
?lang=en|ar

// Events
?category=festival|conference|outdoor|indoor|seasonal
?date=2024-10-15
?lang=en|ar
```

---

## Tech Stack

### Frontend
```
Framework:     Expo 54 + React Native 0.81 + React 19
Routing:       expo-router (file-based)
Styling:       NativeWind (Tailwind for RN)
State:         Zustand (client) + React Query (server)
Animation:     React Native Reanimated
Auth:          Clerk (@clerk/clerk-expo)
Storage:       AsyncStorage
Images:        expo-image
```

### Backend
```
Framework:     Fastify
Database:      PostgreSQL + Drizzle ORM
Auth:          Clerk
Storage:       Cloudflare R2 (S3-compatible)
```

### Key Packages
```json
{
  "expo": "~54.0.25",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "~6.0.13",
  "nativewind": "^4.1.23",
  "zustand": "^5.0.2",
  "@tanstack/react-query": "^5.90.5",
  "react-native-reanimated": "~3.17.5",
  "@clerk/clerk-expo": "^2.19.11",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo-image": "~3.0.10",
  "expo-image-picker": "~16.1.4",
  "lucide-react-native": "^0.544.0"
}
```

### Storage Keys
```
favorites    - Array of favorited item IDs
day_plans    - Array of DayPlan objects
moments      - Array of Moment objects
app_language - Current language ('en' | 'ar')
```

---

## Key UX Features

### Performance
- Memoized components (React.memo)
- Virtualized FlatLists
- Image caching (memory-disk)
- Skeleton loading screens

### Animations
- Spring animations for UI feedback
- Scale animations on press
- Fade transitions between screens
- Slide animations for modals

### RTL Support
- Automatic RTL layout for Arabic
- Reversed tab order
- Mirrored UI elements
- RTL text alignment

### Offline First
- AsyncStorage for local data
- Image upload fallback to local URI
- Optimistic UI updates

---

## App Configuration

### app.json
```json
{
  "expo": {
    "name": "Hasio",
    "slug": "hasio",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "hasio",
    "ios": {
      "bundleIdentifier": "app.rork.hasio"
    },
    "android": {
      "package": "app.rork.hasio"
    }
  }
}
```

### EAS Project ID
```
34cfb3cc-dfba-461d-87eb-2f1fb07f173e
```

---

## Summary

This document contains everything needed to recreate the Hasio Al-Ahsa travel guide app:

- 9 lodging properties with full details
- 8 food establishments with full details
- 8 events with full details
- Complete English/Arabic translations (100+ keys)
- All image URLs
- Complete color/design system
- All TypeScript interfaces
- Backend API structure
- Tech stack specifications

Use this as your migration reference to rebuild the app in a new project.
