import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../../constants/theme';
import { SCHOOLS, type SchoolId } from '../../constants/schedule';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UsersContext';
import { findSharedStudents, countSharedClasses, hasSharedLunch } from '../../lib/store';
import FilterChips from '../../components/FilterChips';
import StudentRow from '../../components/StudentRow';

type SortOption = 'shared' | 'name' | 'lunch';

export default function SearchScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { allUsers } = useUsers();
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [sameLunchOnly, setSameLunchOnly] = useState(false);
  const [schoolFilter, setSchoolFilter] = useState<SchoolId | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('shared');

  const togglePeriod = (period: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
  };

  const results = useMemo(() => {
    if (!profile || selectedPeriods.length === 0) return [];
    let students = findSharedStudents(profile, allUsers, selectedPeriods, sameLunchOnly);

    // Filter by school if selected
    if (schoolFilter) {
      students = students.filter(s => s.school === schoolFilter);
    }

    return students.sort((a, b) => {
      if (sortBy === 'shared') {
        return countSharedClasses(profile, b) - countSharedClasses(profile, a);
      }
      if (sortBy === 'name') {
        return (a.displayName || '').localeCompare(b.displayName || '');
      }
      if (sortBy === 'lunch') {
        const aMatch = a.lunch === profile.lunch ? 0 : 1;
        const bMatch = b.lunch === profile.lunch ? 0 : 1;
        return aMatch - bMatch;
      }
      return 0;
    });
  }, [profile, allUsers, selectedPeriods, sameLunchOnly, schoolFilter, sortBy]);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Select classes to filter by:</Text>
        <FilterChips
          schedule={profile.schedule || {}}
          selected={selectedPeriods}
          onToggle={togglePeriod}
        />

        <View style={styles.controls}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Same lunch only</Text>
            <Switch
              value={sameLunchOnly}
              onValueChange={setSameLunchOnly}
              trackColor={{ true: Colors.primary }}
            />
          </View>

          <View style={styles.schoolRow}>
            <Text style={styles.schoolLabel}>School:</Text>
            <View style={styles.schoolChips}>
              <TouchableOpacity
                style={[styles.schoolChip, !schoolFilter && styles.schoolChipActive]}
                onPress={() => setSchoolFilter(null)}
              >
                <Text style={[styles.schoolChipText, !schoolFilter && styles.schoolChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {(Object.keys(SCHOOLS) as SchoolId[]).map((schoolId) => (
                <TouchableOpacity
                  key={schoolId}
                  style={[styles.schoolChip, schoolFilter === schoolId && styles.schoolChipActive]}
                  onPress={() => setSchoolFilter(schoolId)}
                >
                  <Text style={[styles.schoolChipText, schoolFilter === schoolId && styles.schoolChipTextActive]}>
                    {SCHOOLS[schoolId].abbr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort:</Text>
            {(['shared', 'name', 'lunch'] as SortOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
                onPress={() => setSortBy(opt)}
              >
                <Text style={[styles.sortChipText, sortBy === opt && styles.sortChipTextActive]}>
                  {opt === 'shared' ? 'Most shared' : opt === 'name' ? 'Name' : 'Lunch'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {selectedPeriods.length === 0 ? (
        <View style={styles.placeholder}>
          <Ionicons name="filter" size={48} color={Colors.border} />
          <Text style={styles.placeholderText}>
            Select one or more classes above to find students who share them with you.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.uid}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} student{results.length !== 1 ? 's' : ''} found
            </Text>
          }
          renderItem={({ item }) => (
            <StudentRow
              name={item.displayName || 'Unknown'}
              sharedCount={countSharedClasses(profile, item)}
              sameLunch={hasSharedLunch(profile, item)}
              profilePicture={item.profilePicture}
              onPress={() => router.push({ pathname: '/student/[id]', params: { id: item.uid } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                No students found matching all selected classes.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterSection: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.semiBold,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
  controls: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.text,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  schoolLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
  schoolChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  schoolChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  schoolChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  schoolChipText: {
    fontSize: FontSize.xs,
    fontFamily: Font.medium,
    color: Colors.textSecondary,
  },
  schoolChipTextActive: {
    color: Colors.textOnPrimary,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sortLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
  sortChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  sortChipText: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
  },
  sortChipTextActive: {
    color: Colors.textOnPrimary,
    fontFamily: Font.semiBold,
  },
  resultCount: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    padding: Spacing.md,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  placeholderText: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
});
