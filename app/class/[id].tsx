import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UsersContext';
import { countSharedClasses, hasSharedLunch } from '../../lib/store';
import StudentRow from '../../components/StudentRow';

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { allUsers } = useUsers();

  const { period, subject, teacher } = useMemo(() => {
    if (!id) return { period: '', subject: '', teacher: '' };
    const parts = id.split('-');
    return {
      period: parts[0],
      subject: decodeURIComponent(parts[1] || ''),
      teacher: decodeURIComponent(parts.slice(2).join('-') || ''),
    };
  }, [id]);

  const classmates = useMemo(() => {
    if (!profile) return [];
    return allUsers.filter((u) => {
      if (u.uid === profile.uid) return false;
      const entry = u.schedule?.[period];
      return entry && entry.subject === subject && entry.teacher === teacher;
    });
  }, [profile, allUsers, period, subject, teacher]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `P${period} — ${subject}` }} />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.subject}>{subject}</Text>
          <Text style={styles.teacher}>{teacher}</Text>
          <Text style={styles.period}>Period {period}</Text>
        </View>
        <View style={styles.countBadge}>
          <Ionicons name="people" size={20} color={Colors.primary} />
          <Text style={styles.countText}>{classmates.length}</Text>
          <Text style={styles.countLabel}>student{classmates.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      <FlatList
        data={classmates}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <StudentRow
            name={item.displayName || 'Unknown'}
            sharedCount={profile ? countSharedClasses(profile, item) : 0}
            sameLunch={profile ? hasSharedLunch(profile, item) : false}
            profilePicture={item.profilePicture}
            onPress={() => router.push({ pathname: '/student/[id]', params: { id: item.uid } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No other students have this class yet.</Text>
            <Text style={styles.emptySubtext}>
              As more students join StudySync, classmates will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerInfo: {
    flex: 1,
  },
  subject: {
    fontSize: FontSize.xl,
    fontFamily: Font.bold,
    color: Colors.text,
  },
  teacher: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  period: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: Font.semiBold,
    marginTop: 4,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: Colors.sharedHighlight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  countText: {
    fontSize: FontSize.xl,
    fontFamily: Font.extraBold,
    color: Colors.primary,
  },
  countLabel: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.primary,
  },
  empty: {
    padding: Spacing.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
