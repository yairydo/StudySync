# StudySync

Connect with classmates at your school. Find students who share your classes and lunch periods.

## Features

- 🏫 **Multi-School Support** - JHS & LWHS
- 📚 **Class Matching** - Find classmates by period and subject
- 🍽️ **Lunch Coordination** - See who shares your lunch schedule
- 👥 **Student Profiles** - View schedules and contact information
- 🔍 **Smart Search** - Filter by classes, lunch, and school
- 🔐 **Secure Authentication** - Email/password, Google, and Microsoft sign-in
- 📱 **Cross-Platform** - iOS, Android, and Web

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Backend**: Firebase (Auth + Firestore)
- **UI**: Custom design system with Nunito font
- **Navigation**: Expo Router
- **Build**: EAS Build

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio or Expo Go app
- Firebase project (for backend)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yairydo/StudySync.git
cd StudySync
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

3. **Set up Firebase:**

Create a `firebaseConfig.ts` file in the project root:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

4. **Configure Firebase Console:**
- Enable Authentication (Email/Password, Google, Microsoft)
- Create Firestore database
- Set up Storage
- Add your OAuth client IDs in Authentication settings

## Running the App

### Development Mode

**Expo Go (easiest for testing):**
```bash
npx expo start
```
Scan the QR code with the Expo Go app on your phone.

**iOS Simulator:**
```bash
npx expo start --ios
```

**Android Emulator:**
```bash
npx expo start --android
```

**Web Browser:**
```bash
npx expo start --web
```

### Production Builds

**Android APK:**
```bash
eas build --platform android --profile preview
```

**iOS (requires Apple Developer account):**
```bash
eas build --platform ios --profile preview
```

## Project Structure

```
studysync/
├── app/                    # Screens and routes
│   ├── (tabs)/            # Main tab navigation
│   ├── class/             # Class detail screen
│   ├── student/           # Student profile screen
│   ├── login.tsx          # Login screen
│   └── onboarding.tsx     # Profile setup
├── components/            # Reusable UI components
├── constants/             # Theme, colors, school data
├── contexts/              # React contexts (Auth, Users)
├── lib/                   # Utilities and Firebase
└── assets/                # Images and fonts
```

## Configuration

### School Data

Schools and their classes are defined in `constants/schedule.ts`. To add a new school:

1. Add the school to the `SCHOOLS` object
2. Create subject and teacher arrays for the school
3. Update `getSchoolData()` function

### Design System

The app follows a 2026 UX/UI standard with:
- 8pt grid system
- Minimum 44pt touch targets
- Nunito font family
- Pastel purple theme (#7B4FBF)

Customize in `constants/theme.ts`.

## Developer Mode

For developers (exclusive to configured account):
- Floating dev menu button
- Navigate to any screen without redirects
- Toggle dev mode on/off
- Test authentication flows

Enable by setting your name in `constants/dev.ts`.

## Troubleshooting

**Package conflicts:**
```bash
npm install --legacy-peer-deps
```

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS native modules:**
```bash
npx pod-install
```

**Expo Go not connecting:**
```bash
npx expo start --tunnel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Expo and Firebase
