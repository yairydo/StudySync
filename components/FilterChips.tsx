import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';
import { ScheduleEntry } from '../lib/store';

interface FilterChipsProps {
  schedule: Record<string, ScheduleEntry>;
  selected: string[];
  onToggle: (period: string) => void;
}

export default function FilterChips({ schedule, selected, onToggle }: FilterChipsProps) {
  const periods = Object.keys(schedule).sort();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        {periods.map((period) => {
          const entry = schedule[period];
          if (!entry?.subject) return null;
          const isSelected = selected.includes(period);
          return (
            <TouchableOpacity
              key={period}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onToggle(period)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                P{period}: {entry.subject}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chip: {
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontFamily: Font.medium,
  },
  chipTextSelected: {
    color: Colors.textOnPrimary,
  },
});
