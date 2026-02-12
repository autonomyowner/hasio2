# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hasio is an AI-powered travel guide app for Al-Ahsa Oasis (UNESCO World Heritage site). Built with React Native + Expo (SDK 54) using managed workflow, with full iOS, Android, and Web support.

## Development Commands

```bash
# Start Convex backend (required - run in separate terminal)
npm run convex

# Start Expo dev server
npm start

# Run on platforms
npm run android          # Android emulator
npm run ios              # iOS simulator
npm run web              # Web browser

# Clear cache (use when components don't update properly)
npx expo start --clear   # or npm start -- --clear

# Linting
npm run lint

# Generate icons from SVG
npm run generate-icons

# Deploy Convex to production
npm run convex:deploy
```

### EAS Build Commands

```bash
# Development builds
eas build --platform android --profile development
eas build --platform ios --profile development

# Production builds
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Architecture

### Routing (Expo Router - File-based)

```
app/
├── (tabs)/              # Main tab navigation (7 screens)
│   ├── _layout.tsx      # Custom hierarchical tab bar with arch effect
│   ├── index.tsx        # Home
│   ├── lodging.tsx      # Accommodation
│   ├── food.tsx         # Food & Drinks
│   ├── events.tsx       # Events
│   ├── planner.tsx      # AI Voice Assistant
│   ├── moments.tsx      # Photo gallery
│   └── settings.tsx     # Settings
├── admin/               # Admin dashboard (admin-only access)
│   ├── _layout.tsx      # Admin route guard
│   └── dashboard.tsx    # Content approval & AI report review
├── business/            # Business owner dashboard & posting
├── provider/            # Service provider dashboard
├── onboarding.tsx       # Initial setup flow
└── auth.tsx             # Auth with user type selection
```

### Backend (Convex + Better-Auth)

**Authentication:** Better-auth (`@convex-dev/better-auth`) handles email/password auth. Users are automatically synced to Convex on sign in.

**Database:** Convex provides real-time queries and mutations. Tables:
- `users` - User profiles with userType (user/business/provider/admin)
- `lodgings`, `foods`, `events`, `destinations`, `services` - Content with owner-based auth and approval status
- `moments`, `favorites`, `dayPlans`, `chatMessages` - User-specific data
- `reportedMessages` - AI content reports (Google Play compliance)

**Key Files:**
- `convex/schema.ts` - Database schema with validators
- `convex/users.ts` - User CRUD operations and account deletion
- `convex/admin.ts` - Admin-only queries and mutations (content approval, reports review)
- `convex/lodgings.ts`, `foods.ts`, `events.ts` - Content CRUD with status filtering
- `convex/reportedMessages.ts` - AI message reporting system
- `convex/auth.ts` - Better-auth instance + `getAuthenticatedAppUser` helper
- `convex/convex.config.ts` - Registers better-auth component
- `lib/authClient.ts` - Frontend better-auth client
- `providers/ConvexAuthProvider.tsx` - Auth + Convex integration with auto-sync
- `hooks/useConvexUser.ts` - Get current user from Convex (includes isAdmin)
- `hooks/useConvexData.ts` - Data hooks with mock data fallback

**Auth Flow:**
1. User signs up/in via better-auth (app/auth.tsx)
2. Better-auth issues JWT and stores in expo-secure-store
3. ConvexBetterAuthProvider passes JWT to Convex automatically
4. UserSyncer waits for Convex authentication (isConvexAuthenticated) to be ready
5. Once Convex has valid JWT, user is synced to Convex DB with selected userType
6. App redirects to main tabs

**Critical:** Always wait for session loading (`isPending`) and `isConvexAuthenticated` before attempting operations. The UserSyncer component in `ConvexAuthProvider.tsx` handles this coordination.

### State Management (Zustand)

- **appStore.ts**: Language, theme, local favorites/moments/plans (syncs to Convex when authenticated)
- **momentsStore.ts**: Photo gallery with AsyncStorage persistence

> **Note:** `authStore.ts` and `lib/auth.ts` are deprecated legacy files. Always use `useConvexUser()` hook for auth state instead.

### Key Directories

- `app/` - Expo Router screens (tabs, business, provider, auth)
- `components/screens/` - Page-level content components (use Convex queries)
- `components/ui/` - Reusable base components
- `components/planner/` - Voice assistant components
- `convex/` - Backend functions, schema, seed script
- `providers/` - ConvexAuthProvider for auth + DB
- `hooks/` - useConvexUser, useConvexData, useLanguage
- `lib/` - Utilities: auth, voiceService, elevenlabs TTS, r2Upload
- `constants/` - translations (EN/AR), colors, mockData
- `types/index.ts` - All TypeScript interfaces

### Import Aliases

```typescript
import { useAppStore } from "@/stores/appStore";
import { colors } from "@/constants/colors";
import { translations } from "@/constants/translations";
import type { Lodging, Food, Event } from "@/types";
```

## Styling

Uses **NativeWind** (Tailwind for React Native). Key design tokens in `tailwind.config.js`:

- Primary: `#0D7A5F` (teal)
- Background: `#FAF7F2` (warm sand)
- Fonts: Playfair Display (headings), Plus Jakarta Sans (body)

## Environment Variables

Required in `.env.local`:

```bash
# Convex (auto-generated by `npx convex dev`)
CONVEX_DEPLOYMENT=dev:xxx
EXPO_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://xxx.convex.site

# AI Services (optional)
EXPO_PUBLIC_GROQ_API_KEY=...        # Primary LLM for chat
EXPO_PUBLIC_OPENAI_API_KEY=...      # Fallback LLM
EXPO_PUBLIC_ELEVENLABS_API_KEY=...  # TTS for voice assistant

# Cloudflare R2 (optional - for image uploads)
EXPO_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

**Setup Steps:**
1. Run `npx convex dev --configure` to create Convex project
2. Set `BETTER_AUTH_SECRET` in Convex dashboard (`npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"`)
3. Set `SITE_URL` in Convex dashboard (your app URL, e.g. `http://localhost:8081` for dev)

## Voice Assistant & AI Features

Located in `components/planner/`. Uses:
- `lib/voiceService.ts` - Recording/playback and text chat AI responses
- `lib/elevenlabs.ts` - TTS configuration
- `lib/alahsaKnowledge.ts` - AI system prompt & knowledge base with content safety policy

**AI Content Reporting (Google Play Requirement):**
- Users can long-press AI messages to report inappropriate content
- Reported messages stored in `reportedMessages` table for review
- Content safety rules in system prompt prohibit harmful content (hate speech, violence, misinformation, etc.)
- Required for Google Play AI-generated content policy compliance

## i18n

Full Arabic/English support with RTL layout. Translations in `constants/translations.ts` (~100+ keys).

## Data Patterns

**Screen Components:** Use Convex queries via `hooks/useConvexData.ts` which provides automatic fallback to mock data:

```typescript
import { useLodgings, useFoods, useEvents } from "@/hooks/useConvexData";

// In component
const { lodgings, isLoading, isUsingMockData } = useLodgings("hotel");
const { foods, isLoading } = useFoods("restaurant");
const { events, isLoading } = useEvents();
```

**Posting Forms:** Use Convex mutations with R2 image uploads:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { uploadMultipleToR2 } from "@/lib/r2Upload";

const createLodging = useMutation(api.lodgings.create);

const handleSubmit = async () => {
  const uploadedImages = await uploadMultipleToR2(imageUris, "lodging");
  await createLodging({ ...formData, images: uploadedImages });
};
```

**User Data:** Use `useConvexUser` hook for current user:

```typescript
import { useConvexUser } from "@/hooks/useConvexUser";

const { user, userType, isSignedIn, isLoaded, isBusinessOwner, isServiceProvider, isAdmin } = useConvexUser();
```

**Authentication in Components:** Always use `useConvexUser` (not `useAuthStore`) to check auth state:

```typescript
// Show loading while checking auth
if (!isLoaded) return <ActivityIndicator />;

// Show auth prompt if not signed in
if (!isSignedIn) return <AuthPrompt />;

// Render content for authenticated user
return <YourContent />;
```

## Web Platform Support

The app supports web via Metro bundler. Special considerations:

- `react-native-pager-view` uses platform-specific wrapper (`components/PagerViewWrapper.tsx` + `.web.tsx`)
- Web uses simple View switching instead of swipeable PagerView
- Tab navigation works via button clicks on web (no swipe gestures)

## Initial Data Seeding

Seed the database with mock data:
1. Go to Convex dashboard → Functions
2. Run `seed:seedDatabase` mutation
3. This populates lodgings, foods, events, and destinations from `constants/mockData.ts`

## Google Play Store Compliance

**CRITICAL: Privacy Policy & Data Safety**

The app must maintain accurate privacy policy and data safety documentation:

1. **Privacy Policy Location:** `assets/privacy-policy.html`
   - Must be hosted publicly at: `https://hasio.xyz/privacy-policy.html`
   - References: Better-Auth (auth), Convex (database), Groq (AI), ElevenLabs (TTS)
   - ⚠️ NEVER reference Supabase or Clerk - the app uses Convex/Better-Auth

2. **Data Safety Answers:** `docs/DATA_SAFETY_ANSWERS.md`
   - Complete answers for Google Play Console Data Safety form
   - Third-party services declared: Better-Auth, Convex, Groq, ElevenLabs
   - Must match privacy policy exactly

3. **AI Content Policy Requirements:**
   - In-app reporting feature implemented (long-press AI messages)
   - Content safety rules in `lib/alahsaKnowledge.ts` system prompt
   - Prohibits: hate speech, violence, misinformation, scams, harassment
   - Reported messages stored in `convex/reportedMessages.ts`

4. **Permissions:** All declared in `app.json` (microphone, camera, storage)

5. **Voice Consent:** Required modal in `components/planner/VoiceAssistant.tsx` before first use

**Before Play Store Submission:**
- Verify privacy policy is live and updated
- Ensure Data Safety form matches `DATA_SAFETY_ANSWERS.md`
- Test AI reporting feature works
- Verify voice consent modal appears
- Test account deletion in Settings

## User Roles & Permissions

The app has four user types with different permissions:

| Role | Description | Permissions |
|------|-------------|-------------|
| `user` | Regular tourists/visitors | View content, save favorites, use AI planner, save moments (photo gallery) |
| `business` | Hotels, restaurants, attractions | All user permissions + post lodgings/foods/events/destinations; Moments tab shows "My Listings" |
| `provider` | Tour guides, drivers, etc. | All user permissions + post services; Moments tab shows "My Services" |
| `admin` | Content moderators | All permissions + approve/reject content, review AI reports, manage users |

**Content Approval Workflow:**
1. Business owners post content → status = `pending`
2. Admin reviews in `/admin/dashboard` → approves or rejects
3. Only `approved` content appears in public listings

**Creating an Admin User:**
1. User signs up normally with any userType
2. Go to Convex Dashboard → Data → users table
3. Find the user and change `userType` to `"admin"`
4. Or use the mutation: `admin:setUserAsAdmin` with the user's ID (requires existing admin)

**Admin Dashboard Features (`/admin/dashboard`):**
- Overview: User counts, pending content counts, unreviewed AI reports
- Pending Tab: Review and approve/reject lodgings, foods, events, destinations, services
- Reports Tab: Review flagged AI messages, mark as reviewed

## Build Configuration

**EAS Build Profiles** (from `eas.json`):

- `development` - Dev builds with debug symbols (APK for Android)
- `preview` - Internal testing builds (uses `large` resource class for complex builds)
- `production` - Store-ready builds (AAB for Android, auto-increment version)

**Key Settings:**
- `newArchEnabled: true` in `app.json` - Required for react-native-reanimated 4.x and react-native-worklets
- Android: compileSdk 36, targetSdk 36, minSdk 24
- Package: `com.hasio.travel` (Android), `app.rork.hasio` (iOS)
