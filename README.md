# Hasio - Al-Ahsa Oasis Travel Guide

A modern React Native mobile app for exploring Al-Ahsa Oasis, Saudi Arabia - the world's largest natural oasis and UNESCO World Heritage site.

## Features

- **7 Main Tabs**: Home, Lodging, Food, Events, Planner, Moments, Settings
- **Bilingual Support**: English and Arabic with RTL layout
- **Modern UI**: Text-based navigation (no icons), warm oasis-inspired color palette
- **Offline-First**: Local storage for favorites, moments, and plans
- **Google Fonts**: Playfair Display & Plus Jakarta Sans loaded automatically

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd D:\NASR\hasio

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

- **iOS**: Press `i` to open iOS simulator or scan QR with Expo Go
- **Android**: Press `a` to open Android emulator or scan QR with Expo Go
- **Web**: Press `w` to open in browser

## Project Structure

```
hasio/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home
│   │   ├── lodging.tsx    # Lodging
│   │   ├── food.tsx       # Food & Drinks
│   │   ├── events.tsx     # Events
│   │   ├── planner.tsx    # AI Planner
│   │   ├── moments.tsx    # Photo Gallery
│   │   └── settings.tsx   # Settings
│   ├── _layout.tsx        # Root layout with fonts
│   ├── index.tsx          # Entry redirect
│   └── onboarding.tsx     # Onboarding screen
├── components/            # Reusable components
│   ├── ui/               # Button, Card, FilterChip, etc.
│   ├── lodging/          # LodgingCard
│   ├── food/             # FoodCard
│   ├── events/           # EventCard
│   ├── planner/          # ChatBubble
│   └── moments/          # MomentCard
├── constants/            # App constants
│   ├── colors.ts         # Design tokens
│   ├── translations.ts   # EN/AR strings (100+ keys)
│   └── mockData.ts       # Sample data
├── hooks/               # useLanguage
├── stores/              # Zustand appStore
├── types/               # TypeScript interfaces
├── assets/
│   └── images/          # SVG icons (ready for conversion)
└── scripts/             # Icon generation scripts
```

## Design System

### Color Palette

- **Primary**: `#0D7A5F` (Deep Teal - oasis water)
- **Background**: `#FAF7F2` (Warm Sand)
- **Surface**: `#FFFFFF`
- **Accents**: Blue, Coral, Purple, Gold

### Typography

Fonts are loaded automatically via `@expo-google-fonts`:
- **Display**: Playfair Display (elegant headings)
- **Body**: Plus Jakarta Sans (readable text)

### Design Principles

- No icons in navigation or UI - text labels only
- Warm, oasis-inspired aesthetics
- Generous whitespace
- Smooth spring animations (Reanimated)

## App Icons (Optional)

SVG icons are provided in `assets/images/`. To add custom icons:

1. Convert SVGs to PNG using any online tool (e.g., svgtopng.com)
2. Update `app.json` to reference the PNG files

Or run the helper script:
```bash
scripts\convert-svg-to-png.bat
```

## Tech Stack

- **Framework**: Expo 52 + React Native 0.76
- **Routing**: expo-router (file-based)
- **Styling**: NativeWind (Tailwind for RN)
- **State**: Zustand + AsyncStorage
- **Animations**: React Native Reanimated
- **Images**: expo-image

## Ready for Supabase

This UI shell is ready for backend integration:
- User authentication (Google/Apple OAuth)
- Cloud storage for moments
- Real-time data sync
- Push notifications

Just replace the mock data with Supabase queries!
