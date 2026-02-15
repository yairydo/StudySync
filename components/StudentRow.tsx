import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';

interface StudentRowProps {
  name: string;
  sharedCount: number;
  sameLunch: boolean; // true if they share lunch on any day
  profilePicture?: string;
  onPress: () => void;
  highlighted?: boolean;
}

export default function StudentRow({ name, sharedCount, sameLunch, profilePicture, onPress, highlighted }: StudentRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, highlighted && styles.highlighted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.badges}>
          <View style={styles.sharedBadge}>
            <Ionicons name="book-outline" size={12} color={Colors.primary} />
            <Text style={styles.sharedText}>{sharedCount} shared</Text>
          </View>
          {sameLunch && (
            <View style={styles.lunchBadge}>
              <Ionicons name="restaurant-outline" size={12} color={Colors.success} />
              <Text style={styles.lunchText}>Same lunch</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginVertical: 3,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  highlighted: {
    backgroundColor: Colors.sharedHighlight,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.full,
  },
  avatarText: {
    color: Colors.primary,
    fontFamily: Font.bold,
    fontSize: FontSize.lg,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.text,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: Spacing.sm,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  sharedText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontFamily: Font.medium,
  },
  lunchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.success + '18',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  lunchText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontFamily: Font.medium,
  },
});
