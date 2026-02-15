import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';
import { subjects, teachers, PERIOD_LABELS, getSchoolData, type SchoolId } from '../constants/schedule';
import { ScheduleEntry } from '../lib/store';

const ALL_PERIODS = ['0', '1', '2', '3', '4', '5', '6', '7'];

interface ScheduleBuilderProps {
  schedule: Record<string, ScheduleEntry>;
  onChange: (schedule: Record<string, ScheduleEntry>) => void;
  school?: SchoolId;
}

export default function ScheduleBuilder({ schedule, onChange, school = 'jhs' }: ScheduleBuilderProps) {
  const { subjects, teachers } = getSchoolData(school);
  const [editingPeriod, setEditingPeriod] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<'subject' | 'teacher' | null>(null);
  const [customInput, setCustomInput] = useState('');

  const getTeacherList = (teacher: string): string[] => {
    if (!teacher) return [];
    return teacher.split(' & ').filter(Boolean);
  };

  const updatePeriod = (period: string, field: 'subject' | 'teacher', value: string) => {
    const current = schedule[period] || { subject: '', teacher: '' };
    const updated = { ...current, [field]: value };
    if (field === 'subject') {
      updated.teacher = '';
    }
    onChange({ ...schedule, [period]: updated });
  };

  const addTeacher = (period: string, newTeacher: string) => {
    const current = schedule[period] || { subject: '', teacher: '' };
    const existing = getTeacherList(current.teacher);
    if (existing.includes(newTeacher)) return;
    const updated = { ...current, teacher: [...existing, newTeacher].join(' & ') };
    onChange({ ...schedule, [period]: updated });
  };

  const removeTeacher = (period: string, teacherToRemove: string) => {
    const current = schedule[period] || { subject: '', teacher: '' };
    const existing = getTeacherList(current.teacher).filter(t => t !== teacherToRemove);
    const updated = { ...current, teacher: existing.join(' & ') };
    onChange({ ...schedule, [period]: updated });
  };

  const removePeriod = (period: string) => {
    const newSchedule = { ...schedule };
    delete newSchedule[period];
    onChange(newSchedule);
  };

  // Build a deduplicated list of ALL teachers across all subjects
  const allTeachers = (() => {
    const set = new Set<string>();
    for (const list of Object.values(teachers)) {
      for (const t of list) set.add(t);
    }
    return Array.from(set).sort();
  })();

  const getPickerOptions = (): { items: string[]; suggested: string[] } => {
    if (!editingPeriod) return { items: [], suggested: [] };
    if (pickerType === 'subject') {
      return { items: subjects, suggested: [] };
    }
    if (pickerType === 'teacher') {
      const subject = schedule[editingPeriod]?.subject;
      const suggested = subject && teachers[subject] ? teachers[subject] : [];
      return { items: allTeachers, suggested };
    }
    return { items: [], suggested: [] };
  };

  const isOptionalPeriod = (p: string) => p === '0' || p === '7';

  return (
    <View style={styles.container}>
      {ALL_PERIODS.map((period) => {
        const entry = schedule[period];
        const hasEntry = entry && entry.subject;
        const isOptional = isOptionalPeriod(period);

        if (isOptional && !hasEntry) {
          return (
            <TouchableOpacity
              key={period}
              style={styles.addOptional}
              onPress={() => {
                updatePeriod(period, 'subject', '');
                setEditingPeriod(period);
                setPickerType('subject');
              }}
            >
              <Ionicons name="add-circle-outline" size={22} color={Colors.primaryLight} />
              <Text style={styles.addOptionalText}>
                Add {PERIOD_LABELS[period]}
              </Text>
            </TouchableOpacity>
          );
        }

        if (!isOptional || hasEntry) {
          return (
            <View key={period} style={styles.periodCard}>
              <View style={styles.periodHeader}>
                <View style={styles.periodLabel}>
                  <Text style={styles.periodLabelText}>P{period}</Text>
                </View>
                {isOptional && (
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removePeriod(period)}>
                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={[styles.fieldButton, entry?.subject ? styles.fieldFilled : null]}
                onPress={() => {
                  setEditingPeriod(period);
                  setPickerType('subject');
                }}
              >
                <Ionicons name="book-outline" size={18} color={entry?.subject ? Colors.primary : Colors.textSecondary} />
                <Text
                  style={[styles.fieldText, !entry?.subject && styles.fieldPlaceholder]}
                  numberOfLines={1}
                >
                  {entry?.subject || 'Select class...'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
              {/* Teacher section */}
              {!entry?.subject ? (
                <View style={[styles.fieldButton, styles.fieldDisabled]}>
                  <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
                  <Text style={[styles.fieldText, styles.fieldPlaceholder]}>Select teacher...</Text>
                </View>
              ) : getTeacherList(entry?.teacher || '').length === 0 ? (
                <TouchableOpacity
                  style={styles.fieldButton}
                  onPress={() => {
                    setEditingPeriod(period);
                    setPickerType('teacher');
                  }}
                >
                  <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
                  <Text style={[styles.fieldText, styles.fieldPlaceholder]}>Select teacher...</Text>
                  <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <View style={styles.teacherSection}>
                  <View style={styles.teacherPills}>
                    {getTeacherList(entry.teacher).map((t) => (
                      <View key={t} style={styles.teacherPill}>
                        <Text style={styles.teacherPillText}>{t}</Text>
                        <TouchableOpacity onPress={() => removeTeacher(period, t)}>
                          <Ionicons name="close-circle" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.addTeacherBtn}
                    onPress={() => {
                      setEditingPeriod(period);
                      setPickerType('teacher');
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={18} color={Colors.primaryLight} />
                    <Text style={styles.addTeacherText}>Add another teacher</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }
        return null;
      })}

      <Modal visible={pickerType !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerType === 'subject' ? 'Select Class' : 'Select Teacher'}
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => {
                  setPickerType(null);
                  setEditingPeriod(null);
                  setCustomInput('');
                }}
              >
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={pickerType === 'subject' ? 'Search or type custom class...' : 'Search or type teacher name...'}
                placeholderTextColor={Colors.textSecondary}
                value={customInput}
                onChangeText={setCustomInput}
                autoCapitalize="words"
                autoFocus
              />
              {customInput.length > 0 && (
                <TouchableOpacity onPress={() => setCustomInput('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {customInput.length > 0 && !getPickerOptions().items.some(o => o.toLowerCase() === customInput.toLowerCase()) && (
              <TouchableOpacity
                style={styles.customOption}
                onPress={() => {
                  if (editingPeriod && pickerType) {
                    if (pickerType === 'teacher') {
                      addTeacher(editingPeriod, customInput);
                    } else {
                      updatePeriod(editingPeriod, pickerType, customInput);
                    }
                    setPickerType(null);
                    setEditingPeriod(null);
                    setCustomInput('');
                  }
                }}
              >
                <View style={styles.customIconWrap}>
                  <Ionicons name="add" size={20} color={Colors.textOnPrimary} />
                </View>
                <View>
                  <Text style={styles.customOptionTitle}>Add "{customInput}"</Text>
                  <Text style={styles.customOptionSub}>
                    {pickerType === 'teacher' ? 'Teacher not listed? Add them here' : 'Class not listed? Add it here'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <FlatList
              data={(() => {
                const { items, suggested } = getPickerOptions();
                const filtered = items.filter((o) =>
                  o.toLowerCase().includes(customInput.toLowerCase())
                );
                if (pickerType === 'teacher' && !customInput && suggested.length > 0) {
                  // Show suggested first, then divider, then rest
                  const others = filtered.filter((t) => !suggested.includes(t));
                  return [
                    ...suggested.map((t) => ({ key: t, label: t, suggested: true })),
                    ...(others.length > 0 ? [{ key: '__divider__', label: '', suggested: false }] : []),
                    ...others.map((t) => ({ key: t, label: t, suggested: false })),
                  ];
                }
                return filtered.map((t) => ({ key: t, label: t, suggested: false }));
              })()}
              keyExtractor={(item) => item.key}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                if (item.key === '__divider__') {
                  return (
                    <View style={styles.divider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>All teachers</Text>
                      <View style={styles.dividerLine} />
                    </View>
                  );
                }
                return (
                  <TouchableOpacity
                    style={[styles.optionRow, item.suggested && styles.optionRowSuggested]}
                    onPress={() => {
                      if (editingPeriod && pickerType) {
                        if (pickerType === 'teacher') {
                          addTeacher(editingPeriod, item.label);
                        } else {
                          updatePeriod(editingPeriod, pickerType, item.label);
                        }
                        setPickerType(null);
                        setEditingPeriod(null);
                        setCustomInput('');
                      }
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                    {item.suggested && <Text style={styles.suggestedLabel}>Suggested</Text>}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                !customInput ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name={pickerType === 'teacher' ? 'person-add-outline' : 'search-outline'} size={32} color={Colors.border} />
                    <Text style={styles.emptyText}>
                      {pickerType === 'teacher'
                        ? 'Type a teacher name to search or add'
                        : 'No matching classes'}
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  periodCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodLabel: {
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs,
  },
  periodLabelText: {
    color: Colors.primary,
    fontFamily: Font.extraBold,
    fontSize: FontSize.md,
  },
  removeBtn: {
    padding: 4,
  },
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  fieldFilled: {
    borderColor: Colors.primaryLight + '60',
    backgroundColor: Colors.primarySoft,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  teacherSection: {
    gap: Spacing.sm,
  },
  teacherPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  teacherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.sm + 2,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  teacherPillText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: Font.medium,
  },
  addTeacherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  addTeacherText: {
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
    fontFamily: Font.medium,
  },
  fieldText: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.text,
    flex: 1,
  },
  fieldPlaceholder: {
    color: Colors.textSecondary,
  },
  addOptional: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
  },
  addOptionalText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Font.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '75%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontFamily: Font.bold,
    color: Colors.text,
  },
  modalClose: {
    padding: 6,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.text,
    paddingVertical: 2,
  },
  customOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  customIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customOptionTitle: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontFamily: Font.semiBold,
  },
  customOptionSub: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm + 4,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  optionRowSuggested: {
    backgroundColor: Colors.primarySoft,
  },
  optionText: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.text,
    flex: 1,
  },
  suggestedLabel: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontFamily: Font.semiBold,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: Font.medium,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
