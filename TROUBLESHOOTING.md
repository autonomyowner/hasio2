# EAS Build Troubleshooting Guide

## Critical Issue: New Architecture Required

### Problem
EAS build fails with:
```
[Worklets] Worklets require new architecture to be enabled
[Reanimated] Reanimated requires new architecture to be enabled
```

### Root Cause
- `react-native-reanimated` >= 4.0.0 requires New Architecture
- `react-native-worklets` >= 0.5.0 requires New Architecture
- Project had `newArchEnabled=false`

### Solution
**Enable New Architecture in both locations:**

1. **android/gradle.properties**
   ```properties
   newArchEnabled=true
   ```

2. **app.json**
   ```json
   {
     "expo": {
       "newArchEnabled": true
     }
   }
   ```

3. **Regenerate native code**
   ```bash
   npx expo prebuild --platform android --clean
   ```

4. **Build again**
   ```bash
   eas build --platform android --profile preview
   ```

---

## How to Diagnose Build Failures Faster

### Step 1: ALWAYS Check Build Logs First
1. Go to the build URL provided by EAS
2. Click on the **"Run gradlew"** phase
3. Look for the actual error (FAILURE: or ERROR:)
4. DON'T try random fixes without seeing the actual error

### Step 2: Common EAS Android Build Errors

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `Worklets/Reanimated require new architecture` | New Architecture disabled | Set `newArchEnabled=true` |
| `compileSdkVersion is not specified` | Missing SDK config | Check `android/build.gradle` |
| `Gradle daemon disappeared` | Out of memory | Add `"resourceClass": "large"` to eas.json |
| `Task :app:bundleReleaseJsAndAssets FAILED` | JS bundling error | Run `npx expo export` locally first |

---

## Project Configuration (Working State)

### Dependencies Using New Architecture
- react-native-reanimated: 4.1.6
- react-native-worklets: 0.5.1
- react-native: 0.81.5
- expo: ~54.0.30

### Build Configuration
```json
// eas.json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "resourceClass": "large",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Key Settings
- newArchEnabled: **true** (required)
- hermesEnabled: true
- compileSdk: 36
- targetSdk: 36
- minSdk: 24

---

## Quick Reference: Build Commands

```bash
# Test local bundle (catch errors early)
npx expo export --platform android

# Build preview APK for testing
eas build --platform android --profile preview

# Build production AAB for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production

# View build logs
eas build:view [BUILD_ID]
```

---

## Lessons Learned

1. **Always check actual error logs first** - don't guess
2. **New Architecture is required** for modern reanimated/worklets
3. **Test bundle locally** with `npx expo export` before EAS build
4. **Read the error message carefully** - it usually tells you exactly what's wrong

---

## Text Chat AI Integration Fixed (2025-12-26)

### Problem
Text chat was returning static responses:
- "Thank you for your message! I'm here to help..."
- No AI integration
- Voice assistant worked perfectly, but text chat didn't

### Root Cause
`PlannerScreenContent.tsx` had hardcoded responses instead of calling the AI service.

### Solution
1. Added `getTextChatResponse()` method to `voiceService.ts`
2. Updated `handleSend()` in `PlannerScreenContent.tsx` to use AI
3. Added loading states with animated typing indicator
4. Improved UI/UX:
   - Better header with subtitle
   - Animated suggestion buttons
   - Improved chat bubbles with AI avatar
   - Timestamps on messages
   - Loading indicator while AI responds
   - Better shadows and spacing

### Files Modified
- `lib/voiceService.ts` - Added text chat method
- `components/screens/PlannerScreenContent.tsx` - Connected to AI
- `components/planner/ChatBubble.tsx` - Improved design

---

**Last Updated:** 2025-12-26
**Working Build:** https://expo.dev/accounts/autonomy/projects/hasio/builds/cca162cd-578d-4e2e-957f-7e126c42a081
