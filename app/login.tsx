import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogleWeb,
  useGoogleAuth,
  exchangeGoogleCode,
  useMicrosoftAuth,
  signInWithMicrosoft,
} from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { isDeveloper, getDevMode } from '../lib/devSettings';

export default function LoginScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const google = Platform.OS === 'web' ? null : useGoogleAuth();
  const microsoft = useMicrosoftAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  // Re-check dev mode every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkAndRedirect = async () => {
        // Don't redirect if dev mode is enabled
        const isDevMode = isDeveloper(profile?.displayName) && await getDevMode();
        if (isDevMode) {
          console.log('🔧 Dev mode ON - skipping redirect from login');
          return;
        }

        if (user) {
          console.log('🔀 Dev mode OFF - redirecting from login to app');
          router.replace('/');
        }
      };
      checkAndRedirect();
    }, [user, profile, router])
  );

  useEffect(() => {
    // Only for mobile - web uses signInWithPopup directly
    if (Platform.OS !== 'web' && google?.response?.type === 'success' && google.discovery) {
      const code = google.response.params?.code;
      const codeVerifier = google.request?.codeVerifier;
      if (code && codeVerifier) {
        setLoading(true);
        exchangeGoogleCode(code, codeVerifier, google.redirectUri, google.discovery)
          .catch((e) => {
            console.error('Google sign-in error:', e);
            Alert.alert('Error', 'Google sign-in failed. Please try again.');
            setLoading(false);
          });
      }
    }
  }, [google?.response]);

  useEffect(() => {
    if (microsoft.response?.type === 'success') {
      const { access_token } = microsoft.response.params;
      signInWithMicrosoft(access_token).catch(console.error);
    }
  }, [microsoft.response]);

  const handleGoogleSignIn = async () => {
    if (Platform.OS === 'web') {
      setLoading(true);
      try {
        await signInWithGoogleWeb();
      } catch (e: any) {
        console.error('Google sign-in error:', e);
        Alert.alert('Error', 'Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      google?.promptAsync();
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (e: any) {
      const code = e?.code || '';
      let message = 'Something went wrong. Please try again.';
      if (code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try signing in instead.';
      } else if (code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        message = 'Incorrect email or password.';
      } else if (code === 'auth/user-not-found') {
        message = 'No account found with this email. Try signing up instead.';
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>StudySync</Text>
          <Text style={styles.subtitle}>Find your classmates at JHS</Text>
        </View>

        <View style={styles.hero}>
          <Ionicons name="school" size={64} color={Colors.primary} />
        </View>

        {/* Email/Password Section */}
        <View style={styles.emailSection}>
          <Text style={styles.sectionTitle}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType={isSignUp ? 'newPassword' : 'password'}
          />

          <TouchableOpacity
            style={[styles.emailButton, loading && styles.buttonDisabled]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.emailButtonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* OAuth Buttons */}
        <View style={styles.oauthButtons}>
          <TouchableOpacity
            style={[styles.oauthButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={(Platform.OS !== 'web' && !google?.request) || loading}
          >
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.oauthButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, styles.microsoftButton]}
            onPress={() => microsoft.promptAsync()}
            disabled={!microsoft.request || loading}
          >
            <Ionicons name="logo-microsoft" size={20} color="#fff" />
            <Text style={styles.oauthButtonText}>Microsoft</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Use your LWSD account or create one to get started
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 36,
    fontFamily: Font.extraBold,
    color: Colors.primary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emailSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,  // More breathing room between sections
  },
  sectionTitle: {
    fontSize: FontSize.xl,  // Larger for better hierarchy
    fontFamily: Font.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: FontSize.xl * 1.2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,  // Slightly thicker border
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,  // Consistent with other elements
    paddingHorizontal: Spacing.md,  // 16px internal padding
    paddingVertical: Spacing.sm + 2,  // ~14px vertical padding
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    minHeight: 48,  // Touch target comfortable size
  },
  emailButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    minHeight: 48,  // Comfortable touch target
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontFamily: Font.bold,
  },
  toggleText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    marginHorizontal: Spacing.md,
  },
  oauthButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 48,  // Comfortable touch target
  },
  googleButton: {
    backgroundColor: Colors.google,
  },
  microsoftButton: {
    backgroundColor: Colors.microsoft,
  },
  oauthButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
  },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
});
