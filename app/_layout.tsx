import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { UsersProvider } from '../contexts/UsersContext';
import { Colors } from '../constants/theme';
import DevMenu from '../components/DevMenu';
import { isDeveloper, getDevMode } from '../lib/devSettings';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    // Check dev mode directly from AsyncStorage to get the latest value
    const checkAndNavigate = async () => {
      const isDevMode = isDeveloper(profile?.displayName) && await getDevMode();

      // Skip auto-navigation if developer has dev mode enabled
      if (isDevMode) {
        return;
      }

      const inAuthGroup = segments[0] === 'login';
      const inOnboarding = segments[0] === 'onboarding';

      if (!user && !inAuthGroup) {
        router.replace('/login');
      } else if (user && inAuthGroup) {
        if (!profile || !profile.schedule || Object.keys(profile.schedule).length === 0) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else if (user && !inOnboarding && !inAuthGroup) {
        if (!profile || !profile.schedule || Object.keys(profile.schedule).length === 0) {
          router.replace('/onboarding');
        }
      }
    };

    checkAndNavigate();
  }, [user, profile, loading, segments]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;

}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <UsersProvider>
        <StatusBar style="dark" />
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="class/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="student/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <DevMenu />
        </AuthGate>
      </UsersProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
