import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Font } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UsersContext';
import { countClassmates } from '../../lib/store';
import ClassCard from '../../components/ClassCard';

export default function MyClassesScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { allUsers, loading } = useUsers();

  const classCounts = useMemo(() => {
    if (!profile || allUsers.length === 0) return {};
    return countClassmates(profile, allUsers);
  }, [profile, allUsers]);

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const periods = Object.keys(profile.schedule || {}).sort();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={periods}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Hi, {profile.displayName?.split(' ')[0]}!</Text>
          </View>
        }
        renderItem={({ item: period }) => {
          const entry = profile.schedule[period];
          if (!entry?.subject) return null;
          return (
            <ClassCard
              period={period}
              subject={entry.subject}
              teacher={entry.teacher}
              studentCount={classCounts[period] || 0}
              onPress={() =>
                router.push({
                  pathname: '/class/[id]',
                  params: {
                    id: `${period}-${encodeURIComponent(entry.subject)}-${encodeURIComponent(entry.teacher)}`,
                  },
                })
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No classes set up yet.</Text>
          </View>
        }
      />
      {loading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading classmates...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingTop: Spacing.md,
    paddingBottom: 120,  // Space for floating tab bar
  },
  header: {
    paddingHorizontal: Spacing.md,  // 16px screen margins
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.xs,
  },
  greeting: {
    fontSize: FontSize.xxl,  // Larger greeting for better hierarchy
    fontFamily: Font.extraBold,
    color: Colors.text,
    lineHeight: FontSize.xxl * 1.2,
  },
  empty: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  loadingText: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
});
