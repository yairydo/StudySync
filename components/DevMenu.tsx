import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';
import { DEV_SCREEN } from '../constants/dev';
import { isDeveloper, getDevMode, toggleDevMode } from '../lib/devSettings';
import { useAuth } from '../contexts/AuthContext';

export default function DevMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const router = useRouter();
  const { profile } = useAuth();

  // Check if current user is the developer
  const isDevAccount = isDeveloper(profile?.displayName);

  // Load dev mode state
  useEffect(() => {
    if (isDevAccount) {
      getDevMode().then(setDevModeEnabled);
    }
  }, [isDevAccount]);

  // Only show for developer account
  if (!isDevAccount) return null;

  const navigateTo = (screen: 'login' | 'onboarding' | 'app') => {
    setIsOpen(false);
    // Force navigation by replacing the route
    if (screen === 'login') {
      router.replace('/login');
    } else if (screen === 'onboarding') {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  };

  const reloadApp = () => {
    setIsOpen(false);
    // Force a reload by navigating to index
    router.replace('/');
  };

  const handleToggleDevMode = async () => {
    const newValue = await toggleDevMode();
    setDevModeEnabled(newValue);
    Alert.alert(
      'Dev Mode ' + (newValue ? 'Enabled' : 'Disabled'),
      newValue
        ? 'Auto-redirects are now disabled. You can test login/onboarding screens.'
        : 'Auto-redirects are now enabled. Screens will behave normally.',
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      {/* Floating Dev Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="construct" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Dev Menu Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>🔧 Developer Menu</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={28} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menu} contentContainerStyle={styles.menuContent}>
              <View style={styles.toggleSection}>
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>Developer Mode</Text>
                  <Text style={styles.toggleDesc}>
                    {devModeEnabled ? 'Features enabled' : 'Features disabled'}
                  </Text>
                </View>
                <Switch
                  value={devModeEnabled}
                  onValueChange={handleToggleDevMode}
                  trackColor={{ true: Colors.primary, false: '#D1D5DB' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Navigate to Screen:</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('login')}
              >
                <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Login Screen</Text>
                  <Text style={styles.menuItemDesc}>Test authentication UI</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('onboarding')}
              >
                <Ionicons name="school-outline" size={24} color={Colors.primary} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Onboarding / Setup</Text>
                  <Text style={styles.menuItemDesc}>Test profile creation</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('app')}
              >
                <Ionicons name="home-outline" size={24} color={Colors.primary} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Main App</Text>
                  <Text style={styles.menuItemDesc}>Home, search, profile tabs</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Actions:</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={reloadApp}
              >
                <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Reload App</Text>
                  <Text style={styles.menuItemDesc}>Restart from index</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  👤 Developer Account: <Text style={styles.infoBold}>Yair Donenfeld</Text>
                </Text>
                <Text style={styles.infoText}>
                  Only you can see this menu!
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: Font.bold,
    color: Colors.text,
  },
  menu: {
    padding: Spacing.lg,
  },
  menuContent: {
    paddingBottom: 60,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primarySoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: FontSize.md,
    fontFamily: Font.bold,
    color: Colors.primary,
  },
  toggleDesc: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.primary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: Font.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.text,
  },
  menuItemDesc: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  infoBox: {
    backgroundColor: Colors.primarySoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.primary,
  },
  infoBold: {
    fontFamily: Font.bold,
  },
});
