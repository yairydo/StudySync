import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../../constants/theme';
import { LUNCH_DAYS, SCHOOLS } from '../../constants/schedule';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import { pickImage, uploadProfilePicture } from '../../lib/imageUpload';
import { saveUserProfile } from '../../lib/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, user, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleChangeProfilePicture = async () => {
    if (!user) return;
    const uri = await pickImage();
    if (uri) {
      setUploading(true);
      try {
        const url = await uploadProfilePicture(user.uid, uri);
        await saveUserProfile(user.uid, { profilePicture: url });
        await refreshProfile();
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload profile picture.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  if (!profile) return null;

  const periods = Object.keys(profile.schedule || {}).sort();

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleChangeProfilePicture} disabled={uploading}>
          <View style={styles.avatar}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {(profile.displayName || '?').charAt(0).toUpperCase()}
              </Text>
            )}
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color={Colors.textOnPrimary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={Colors.textOnPrimary} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{profile.displayName}</Text>
        <View style={styles.schoolBadge}>
          <Ionicons name="school-outline" size={14} color={Colors.primary} />
          <Text style={styles.schoolBadgeText}>{SCHOOLS[profile.school]?.name || 'JHS'}</Text>
        </View>
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      </View>

      {/* Lunch Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lunch Schedule</Text>
        {LUNCH_DAYS.map((day) => (
          <View key={day} style={styles.lunchRow}>
            <Text style={styles.lunchDay}>{day}</Text>
            <View style={styles.lunchBadge}>
              <Text style={styles.lunchBadgeText}>
                {profile.lunch?.[day] || 'Not set'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {(profile.contacts?.instagram || profile.contacts?.discord || profile.contacts?.snapchat || profile.contacts?.tiktok || profile.contacts?.phone || (profile.contacts?.other && profile.contacts.other.length > 0)) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {profile.contacts.instagram && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(profile.contacts.instagram!)}>
              <Ionicons name="logo-instagram" size={18} color="#E4405F" />
              <Text style={styles.contactLink}>Instagram</Text>
            </TouchableOpacity>
          )}
          {profile.contacts.snapchat && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(profile.contacts.snapchat!)}>
              <Ionicons name="logo-snapchat" size={18} color="#FFFC00" />
              <Text style={styles.contactLink}>Snapchat</Text>
            </TouchableOpacity>
          )}
          {profile.contacts.tiktok && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(profile.contacts.tiktok!)}>
              <Ionicons name="logo-tiktok" size={18} color={Colors.text} />
              <Text style={styles.contactLink}>TikTok</Text>
            </TouchableOpacity>
          )}
          {profile.contacts.phone && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${profile.contacts.phone}`)}>
              <Ionicons name="call" size={18} color={Colors.primary} />
              <Text style={styles.contactLink}>{profile.contacts.phone}</Text>
            </TouchableOpacity>
          )}
          {profile.contacts.discord && (
            <View style={styles.contactRow}>
              <Ionicons name="logo-discord" size={18} color="#5865F2" />
              <Text style={styles.contactText}>{profile.contacts.discord}</Text>
            </View>
          )}
          {profile.contacts.other?.map((link, index) => (
            <TouchableOpacity key={index} style={styles.contactRow} onPress={() => Linking.openURL(link.url)}>
              <Ionicons name="link" size={18} color={Colors.text} />
              <Text style={styles.contactLink}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Schedule</Text>
        {periods.map((period) => {
          const entry = profile.schedule[period];
          if (!entry?.subject) return null;
          return (
            <View key={period} style={styles.scheduleRow}>
              <Text style={styles.periodLabel}>P{period}</Text>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleSubject}>{entry.subject}</Text>
                <Text style={styles.scheduleTeacher}>{entry.teacher}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/onboarding')}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={styles.editButtonText}>Edit Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontFamily: Font.extraBold,
    fontSize: FontSize.xxl,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.xl,
    fontFamily: Font.bold,
    color: Colors.text,
  },
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  schoolBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: Font.semiBold,
    color: Colors.primary,
  },
  bio: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  lunchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  lunchDay: {
    fontSize: FontSize.sm,
    fontFamily: Font.medium,
    color: Colors.text,
  },
  lunchBadge: {
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  lunchBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: Font.semiBold,
    color: Colors.primary,
  },
  section: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  contactText: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.text,
  },
  contactLink: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  periodLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.bold,
    color: Colors.primary,
    width: 36,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleSubject: {
    fontSize: FontSize.md,
    fontFamily: Font.medium,
    color: Colors.text,
  },
  scheduleTeacher: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
  actions: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  editButtonText: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  signOutButtonText: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.error,
  },
});
