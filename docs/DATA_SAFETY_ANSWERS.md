# Data Safety Form - Complete Answers for Google Play

Use these exact answers when filling out the Data Safety form in Google Play Console.

---

## Section 1: Data Collection and Security

### Does your app collect or share any of the required user data types?
**Answer: Yes**

### Is all of the user data collected by your app encrypted in transit?
**Answer: Yes**
- All API calls use HTTPS
- Supabase connections are encrypted
- Voice data transmitted over TLS

### Do you provide a way for users to request that their data is deleted?
**Answer: Yes**
- Users can delete their account in Settings
- This removes all associated data from Supabase

---

## Section 2: Data Types

### Personal Info

#### Name
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** No (optional during registration)
- **Purpose:** Account management

#### Email address
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** Yes (for account creation)
- **Purpose:** Account management, App functionality

#### User IDs
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** Yes (internal use)
- **Purpose:** App functionality

---

### Photos and Videos

#### Photos
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** No (optional - Moments feature)
- **Purpose:** App functionality (saving travel moments)

---

### Audio

#### Voice or sound recordings
- **Collected:** Yes
- **Shared:** Yes (with third-party speech services)
- **Ephemeral:** Yes (not stored permanently)
- **Required:** No (optional - voice assistant)
- **Purpose:** App functionality (voice assistant)

**Third parties receiving audio data:**
- Groq (speech-to-text processing)
- ElevenLabs (text-to-speech generation)

---

### App Activity

#### App interactions
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** Yes
- **Purpose:** Analytics, App functionality

#### In-app search history
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** No
- **Purpose:** App functionality (search history)

---

### Device or other IDs

#### Device or other IDs
- **Collected:** Yes
- **Shared:** No
- **Ephemeral:** No
- **Required:** Yes
- **Purpose:** App functionality, Analytics

---

## Section 3: Data NOT Collected

The following data types are NOT collected by Hasio:

- Financial info (no payments in app)
- Health info
- Messages
- Contacts
- Calendar
- Browsing history
- Precise location (only general location tags added manually by user)
- Files and docs
- Race and ethnicity
- Political or religious beliefs
- Sexual orientation
- Other personal information

---

## Section 4: Data Usage and Handling

### Purpose Declarations

#### Account management
- Email address
- Name
- User IDs

#### App functionality
- Email address
- Photos
- Voice recordings
- App interactions
- Device IDs

#### Analytics
- App interactions
- Device IDs

---

## Section 5: Data Sharing

### Voice data is shared with:

**Groq Inc.**
- Purpose: Speech-to-text transcription
- Data: Voice recordings (ephemeral)
- Their privacy policy: https://groq.com/privacy-policy/

**ElevenLabs**
- Purpose: Text-to-speech generation
- Data: Text content for voice synthesis
- Their privacy policy: https://elevenlabs.io/privacy-policy

### Why sharing is necessary:
Voice assistant functionality requires real-time speech processing which is performed by specialized third-party AI services.

---

## Section 6: Security Practices Summary

| Practice | Status |
|----------|--------|
| Data encrypted in transit | Yes (TLS/HTTPS) |
| Data encrypted at rest | Yes (Supabase) |
| Users can request deletion | Yes |
| Security review | Supabase manages infrastructure security |

---

## Quick Reference Table for Form

| Data Type | Collected | Shared | Ephemeral | Optional | Purpose |
|-----------|-----------|--------|-----------|----------|---------|
| Email | Yes | No | No | No | Account |
| Name | Yes | No | No | Yes | Account |
| User ID | Yes | No | No | No | Functionality |
| Photos | Yes | No | No | Yes | Functionality |
| Voice | Yes | Yes* | Yes | Yes | Functionality |
| App activity | Yes | No | No | No | Analytics |
| Device ID | Yes | No | No | No | Functionality |

*Shared with Groq and ElevenLabs for processing

---

## Important Notes for Form Completion

1. **Be honest** - Google verifies this information
2. **Voice data sharing** - Must declare because we send audio to third parties
3. **Photos** - User controls when to save, but we do store them
4. **Ephemeral data** - Voice is ephemeral (processed but not stored)
5. **Optional data** - Name, photos, voice are optional features

---

## After Completing the Form

Google will display a Data Safety section on your app listing showing:
- What data is collected
- Whether data is encrypted
- Whether users can request deletion
- What data is shared and with whom

This transparency builds user trust.
