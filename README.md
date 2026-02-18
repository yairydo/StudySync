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

### All Platforms
- Node.js (v16 or higher)
- npm or yarn
- Git
- Firebase project (for backend)
- Expo Go app (for testing on physical devices)

### Platform-Specific

**macOS:**
- Xcode 14+ (for iOS development)
- CocoaPods (installed automatically via Homebrew)
- Command Line Tools: `xcode-select --install`

**Windows:**
- Android Studio (for Android development)
- Windows Subsystem for Linux (WSL) recommended for better compatibility
- Java Development Kit (JDK) 17+

**Linux (Ubuntu/Debian):**
- Android Studio (for Android development)
- Java Development Kit (JDK) 17+
```bash
sudo apt-get update
sudo apt-get install openjdk-17-jdk
```

**Android Development (all platforms):**
- Android Studio with Android SDK
- Android Emulator or physical Android device
- Environment variables: `ANDROID_HOME`, `JAVA_HOME`

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

#### On macOS

**iOS Simulator:**
```bash
npx expo start --ios
```
- Automatically opens in iOS Simulator
- First run may take longer to build
- Hot reload enabled

**iOS Device (Xcode):**
1. Generate iOS native code: `npx expo prebuild`
2. Open `ios/studysync.xcworkspace` in Xcode
3. Select your device
4. Press Run (⌘R)

**Android Emulator:**
```bash
npx expo start --android
```
- Requires Android Studio and emulator setup
- Hot reload enabled

**Web Browser:**
```bash
npx expo start --web
```
- Opens in default browser at `http://localhost:8081`

#### On Windows

**Android Emulator:**
```bash
npx expo start --android
```
- Requires Android Studio installed
- Configure Android SDK path in environment variables
- Start emulator from Android Studio first

**Expo Go (Physical Device):**
```bash
npx expo start
```
- Scan QR code with Expo Go app
- Use `--tunnel` flag if connection fails:
```bash
npx expo start --tunnel
```

**Web Browser:**
```bash
npx expo start --web
```

#### On Linux

**Android Emulator:**
```bash
npx expo start --android
```
- Requires Android Studio and SDK tools
- May need to configure KVM for hardware acceleration:
```bash
sudo apt-get install qemu-kvm
sudo adduser $USER kvm
```

**Expo Go (Physical Device):**
```bash
npx expo start --tunnel
```
- Tunnel mode recommended for better connectivity

**Web Browser:**
```bash
npx expo start --web
```

### Testing on Physical Devices

**All Platforms:**

1. **Install Expo Go:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Connect to Metro:**
```bash
npx expo start
```

3. **Scan QR Code:**
   - iOS: Open Camera app and scan
   - Android: Open Expo Go app and scan

4. **If connection fails:**
```bash
npx expo start --tunnel
```
This works on any network (including cellular data).

### Production Builds

#### Android (APK/AAB)

**Preview Build (for testing):**
```bash
eas build --platform android --profile preview
```
- Generates APK file
- Can be installed directly on devices
- No Google Play Store needed

**Production Build:**
```bash
eas build --platform android --profile production
```
- Generates AAB for Google Play Store
- Requires signing key

#### iOS (IPA)

**Requirements:**
- Apple Developer account ($99/year)
- Signing certificates configured in EAS

**Preview Build (TestFlight):**
```bash
eas build --platform ios --profile preview
```

**Production Build:**
```bash
eas build --platform ios --profile production
```

#### Multi-Platform Build

**Build for both platforms:**
```bash
eas build --platform all
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

### General Issues

**Package conflicts:**
```bash
npm install --legacy-peer-deps
```

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Clear all caches:**
```bash
npm start -- --reset-cache
```

### iOS-Specific (macOS)

**CocoaPods errors:**
```bash
cd ios
pod install
cd ..
```

**Native module linking issues:**
```bash
npx expo prebuild --clean
cd ios && pod install && cd ..
```

**Xcode build errors:**
1. Clean build folder: Product → Clean Build Folder (⌘⇧K)
2. Delete derived data:
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```
3. Rebuild CocoaPods:
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

**Simulator not showing:**
```bash
sudo xcode-select --reset
```

### Android-Specific (All Platforms)

**Emulator won't start (Linux):**
```bash
# Enable KVM acceleration
sudo apt-get install qemu-kvm
sudo adduser $USER kvm
# Restart required
```

**Gradle build errors:**
```bash
cd android
./gradlew clean
cd ..
```

**ANDROID_HOME not set (Windows):**
```cmd
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
```

**ANDROID_HOME not set (Linux/macOS):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Expo Go Issues

**Phone not connecting:**
```bash
npx expo start --tunnel
```

**"Something went wrong" error:**
- Clear Expo Go cache in app settings
- Restart Metro bundler with `--clear` flag
- Update Expo Go to latest version

**QR code won't scan:**
- Ensure phone and computer on same WiFi
- Use tunnel mode: `npx expo start --tunnel`
- Manually enter URL from terminal into Expo Go

### Windows-Specific

**Metro bundler not starting:**
- Run PowerShell as Administrator
- Disable antivirus temporarily
- Add exception for Node.js in Windows Firewall

**"Cannot find module" errors:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Linux-Specific

**Permission denied errors:**
```bash
sudo chown -R $USER:$USER node_modules
```

**Watchman issues:**
```bash
# Install watchman for better file watching
sudo apt-get install watchman
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
