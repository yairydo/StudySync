# Development Mode

## How to Use

### Enabling Dev Mode
1. Open `constants/dev.ts`
2. Set `DEV_MODE = true`
3. Reload the app

### Disabling Dev Mode
1. Open `constants/dev.ts`
2. Set `DEV_MODE = false`
3. Reload the app

## What Dev Mode Does

When enabled, dev mode:
- ✅ Bypasses Firebase authentication
- ✅ Uses mock user and profile data
- ✅ Allows you to view all screens without signing in
- ✅ Shows an orange "🔧 DEV MODE" banner at the top
- ✅ Lets you test features without creating accounts

## Developer Menu (In-App Navigation)

When dev mode is enabled, you'll see a **floating orange button** (🔧) in the bottom-right corner.

**Tap it to:**
- 🔄 Navigate to Login Screen
- 🔄 Navigate to Onboarding/Setup Screen
- 🔄 Navigate to Main App
- 🔄 Reload the app

**No code editing needed!** Just tap the button and select where you want to go.

## Choosing Which Screen to View (Alternative Method)

You can also set `DEV_SCREEN` in `constants/dev.ts`:

```typescript
export const DEV_SCREEN: 'login' | 'onboarding' | 'app' = 'app';
```

Options:
- **`'login'`** - View login screen (no authentication)
- **`'onboarding'`** - View setup/onboarding screen (logged in, but no profile)
- **`'app'`** - View main app (logged in with complete profile)

## Customizing Mock Data

Edit `constants/dev.ts` to change:
- User information (`MOCK_USER`)
- Profile data (`MOCK_PROFILE`)
- Schedule, lunch, contacts, etc.

## Example Mock Profile

```typescript
export const MOCK_PROFILE = {
  uid: 'dev-user-123',
  displayName: 'Your Name',
  school: 'jhs', // or 'lwhs'
  lunch: {
    Monday: '1st',
    Tuesday: '2nd',
    // ...
  },
  schedule: {
    '1': { subject: 'Math', teacher: 'Teacher Name' },
    // ...
  },
  // ...
};
```

## Important Notes

⚠️ **Always disable dev mode before deploying to production!**

⚠️ **Dev mode data is not saved to Firebase**

⚠️ **Changes made in dev mode won't persist after reload**
