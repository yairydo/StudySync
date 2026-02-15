import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../../constants/theme';
import { LUNCH_DAYS } from '../../constants/schedule';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UsersContext';
import { countSharedClasses, hasSharedLunch } from '../../lib/store';

export default function StudentProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile: myProfile } = useAuth();
  const { allUsers } = useUsers();

  const student = useMemo(() => {
    return allUsers.find((u) => u.uid === id) || null;
  }, [allUsers, id]);

  const sharedCount = useMemo(() => {
    if (!myProfile || !student) return 0;
    return countSharedClasses(myProfile, student);
  }, [myProfile, student]);

  const isSharedClass = (period: string) => {
    if (!myProfile || !student) return false;
    const mine = myProfile.schedule?.[period];
    const theirs = student.schedule?.[period];
    return mine && theirs && mine.subject === theirs.subject && mine.teacher === theirs.teacher;
  };

  if (!student) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Student not found.</Text>
      </View>
    );
  }

  const periods = Object.keys(student.schedule || {}).sort();

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: student.displayName || 'Profile' }} />

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {student.profilePicture ? (
            <Image source={{ uri: student.profilePicture }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {(student.displayName || '?').charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={styles.name}>{student.displayName}</Text>
        {student.bio ? <Text style={styles.bio}>{student.bio}</Text> : null}

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="book" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>{sharedCount} shared</Text>
          </View>
          {myProfile && hasSharedLunch(myProfile, student) && (
            <View style={[styles.badge, { backgroundColor: Colors.success + '18' }]}>
              <Ionicons name="restaurant" size={14} color={Colors.success} />
              <Text style={[styles.badgeText, { color: Colors.success }]}>
                Same lunch
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Lunch Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lunch Schedule</Text>
        {LUNCH_DAYS.map((day) => {
          const myLunch = myProfile?.lunch?.[day];
          const theirLunch = student.lunch?.[day];
          const isShared = myLunch && theirLunch && myLunch === theirLunch;
          return (
            <View key={day} style={[styles.lunchRow, isShared && styles.lunchRowShared]}>
              <Text style={styles.lunchDay}>{day}</Text>
              <View style={styles.lunchBadge}>
                <Text style={styles.lunchBadgeText}>
                  {theirLunch || 'Not set'}
                </Text>
                {isShared && <Ionicons name="checkmark-circle" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />}
              </View>
            </View>
          );
        })}
      </View>

      {(student.contacts?.instagram || student.contacts?.discord || student.contacts?.snapchat || student.contacts?.tiktok || student.contacts?.phone || (student.contacts?.other && student.contacts.other.length > 0)) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {student.contacts.instagram && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(student.contacts.instagram!)}>
              <Ionicons name="logo-instagram" size={18} color="#E4405F" />
              <Text style={styles.contactLink}>Instagram</Text>
            </TouchableOpacity>
          )}
          {student.contacts.snapchat && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(student.contacts.snapchat!)}>
              <Ionicons name="logo-snapchat" size={18} color="#FFFC00" />
              <Text style={styles.contactLink}>Snapchat</Text>
            </TouchableOpacity>
          )}
          {student.contacts.tiktok && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(student.contacts.tiktok!)}>
              <Ionicons name="logo-tiktok" size={18} color={Colors.text} />
              <Text style={styles.contactLink}>TikTok</Text>
            </TouchableOpacity>
          )}
          {student.contacts.phone && (
            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${student.contacts.phone}`)}>
              <Ionicons name="call" size={18} color={Colors.primary} />
              <Text style={styles.contactLink}>{student.contacts.phone}</Text>
            </TouchableOpacity>
          )}
          {student.contacts.discord && (
            <View style={styles.contactRow}>
              <Ionicons name="logo-discord" size={18} color="#5865F2" />
              <Text style={styles.contactText}>{student.contacts.discord}</Text>
            </View>
          )}
          {student.contacts.other?.map((link, index) => (
            <TouchableOpacity key={index} style={styles.contactRow} onPress={() => Linking.openURL(link.url)}>
              <Ionicons name="link" size={18} color={Colors.text} />
              <Text style={styles.contactLink}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        {periods.map((period) => {
          const entry = student.schedule[period];
          if (!entry?.subject) return null;
          const shared = isSharedClass(period);
          return (
            <View key={period} style={[styles.scheduleRow, shared && styles.scheduleRowShared]}>
              <Text style={styles.periodLabel}>P{period}</Text>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleSubject}>{entry.subject}</Text>
                <Text style={styles.scheduleTeacher}>{entry.teacher}</Text>
              </View>
              {shared && (
                <View style={styles.sharedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                  <Text style={styles.sharedBadgeText}>Shared</Text>
                </View>
              )}
            </View>
          );
        })}
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
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
  name: {
    fontSize: FontSize.xl,
    fontFamily: Font.bold,
    color: Colors.text,
  },
  bio: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.sharedHighlight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
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
  lunchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  lunchRowShared: {
    backgroundColor: Colors.sharedHighlight,
  },
  lunchDay: {
    fontSize: FontSize.sm,
    fontFamily: Font.medium,
    color: Colors.text,
  },
  lunchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  scheduleRowShared: {
    backgroundColor: Colors.sharedHighlight,
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
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sharedBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontFamily: Font.semiBold,
  },
});
