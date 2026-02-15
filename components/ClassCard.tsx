import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';

interface ClassCardProps {
  period: string;
  subject: string;
  teacher: string;
  studentCount: number;
  onPress: () => void;
}

export default function ClassCard({ period, subject, teacher, studentCount, onPress }: ClassCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.periodBadge}>
        <Text style={styles.periodText}>P{period}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.subject} numberOfLines={1}>{subject}</Text>
        <Text style={styles.teacher} numberOfLines={1}>{teacher}</Text>
      </View>
      <View style={styles.countContainer}>
        <Ionicons name="people" size={18} color={Colors.primary} />
        <Text style={styles.count}>{studentCount}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,  // 12px between cards
    minHeight: 80,  // Comfortable touch target
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  periodBadge: {
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.sm,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  periodText: {
    color: Colors.primary,
    fontFamily: Font.extraBold,
    fontSize: FontSize.lg,
  },
  info: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  subject: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.text,
    lineHeight: FontSize.md * 1.4,
  },
  teacher: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs / 2,  // 4px spacing
    lineHeight: FontSize.sm * 1.5,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    gap: 4,
  },
  count: {
    fontSize: FontSize.sm,
    fontFamily: Font.bold,
    color: Colors.primary,
  },
});
