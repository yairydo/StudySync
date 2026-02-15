import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Font } from '../constants/theme';
import { LUNCH_OPTIONS, LUNCH_DAYS, SCHOOLS, type SchoolId } from '../constants/schedule';
import ScheduleBuilder from '../components/ScheduleBuilder';
import { useAuth } from '../contexts/AuthContext';
import { saveUserProfile, ScheduleEntry } from '../lib/store';
import { pickImage, uploadProfilePicture } from '../lib/imageUpload';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, refreshProfile, profile } = useAuth();
  const isEditing = !!profile;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [school, setSchool] = useState<SchoolId>('jhs');
  const [bio, setBio] = useState('');
  const [lunch, setLunch] = useState<Record<string, '1st' | '2nd'>>({});
  const [schedule, setSchedule] = useState<Record<string, ScheduleEntry>>({});
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [phone, setPhone] = useState('');
  const [otherLinks, setOtherLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load existing profile data when editing
  useEffect(() => {
    if (profile && !loaded) {
      setDisplayName(profile.displayName || '');
      setSchool(profile.school || 'jhs');
      setBio(profile.bio || '');
      setLunch(profile.lunch || {});
      setSchedule(profile.schedule || {});
      setInstagram(profile.contacts?.instagram || '');
      setDiscord(profile.contacts?.discord || '');
      setSnapchat(profile.contacts?.snapchat || '');
      setTiktok(profile.contacts?.tiktok || '');
      setPhone(profile.contacts?.phone || '');
      setOtherLinks(profile.contacts?.other || []);
      setProfilePicture(profile.profilePicture || null);
      setLoaded(true);
    }
  }, [profile, loaded]);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setProfilePicture(uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate at least periods 1-6 have subjects
    const corePeriods = ['1', '2', '3', '4', '5', '6'];
    const missing = corePeriods.filter((p) => !schedule[p]?.subject || !schedule[p]?.teacher);
    if (missing.length > 0) {
      Alert.alert('Incomplete Schedule', `Please fill in all fields for period${missing.length > 1 ? 's' : ''} ${missing.join(', ')}.`);
      return;
    }

    // Check that all lunch days have lunch selected (Wednesday excluded)
    const missingDays = LUNCH_DAYS.filter((day) => !lunch[day]);
    if (missingDays.length > 0) {
      Alert.alert('Select Lunch', `Please select lunch for: ${missingDays.join(', ')}`);
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Enter Name', 'Please enter your display name.');
      return;
    }

    setSaving(true);
    try {
      const filteredOtherLinks = otherLinks.filter((link) => link.title && link.url);

      const contacts: any = {};
      if (instagram.trim()) contacts.instagram = instagram.trim();
      if (discord.trim()) contacts.discord = discord.trim();
      if (snapchat.trim()) contacts.snapchat = snapchat.trim();
      if (tiktok.trim()) contacts.tiktok = tiktok.trim();
      if (phone.trim()) contacts.phone = phone.trim();
      if (filteredOtherLinks.length > 0) contacts.other = filteredOtherLinks;

      // Upload profile picture if a new one was selected (local file URI)
      let profilePictureUrl: string | undefined = profile?.profilePicture;
      if (profilePicture && profilePicture.startsWith('file://')) {
        setUploading(true);
        try {
          profilePictureUrl = await uploadProfilePicture(user.uid, profilePicture);
        } catch (error) {
          Alert.alert('Upload Error', 'Failed to upload profile picture. Continuing without it.');
        } finally {
          setUploading(false);
        }
      } else if (profilePicture && profilePicture.startsWith('https://')) {
        // Keep existing Firebase URL
        profilePictureUrl = profilePicture;
      }

      await saveUserProfile(user.uid, {
        displayName: displayName.trim(),
        school,
        profilePicture: profilePictureUrl,
        lunch,
        bio: bio.trim(),
        contacts,
        schedule,
      });
      await refreshProfile();

      if (isEditing) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.heading}>{isEditing ? 'Edit Profile' : 'Welcome to StudySync!'}</Text>
        <Text style={styles.subheading}>
          {isEditing ? 'Update your schedule and profile information.' : 'Set up your schedule to find classmates.'}
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Profile Picture (optional)</Text>
          <TouchableOpacity style={styles.profilePictureContainer} onPress={handlePickImage}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profilePictureImage} />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Ionicons name="camera" size={32} color={Colors.textSecondary} />
                <Text style={styles.profilePictureText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>School</Text>
          <View style={styles.schoolOptions}>
            {(Object.keys(SCHOOLS) as SchoolId[]).map((schoolId) => (
              <TouchableOpacity
                key={schoolId}
                style={[
                  styles.schoolOption,
                  school === schoolId && styles.schoolSelected,
                ]}
                onPress={() => setSchool(schoolId)}
              >
                <Text
                  style={[
                    styles.schoolText,
                    school === schoolId && styles.schoolTextSelected,
                  ]}
                >
                  {SCHOOLS[schoolId].abbr}
                </Text>
                <Text
                  style={[
                    styles.schoolSubtext,
                    school === schoolId && styles.schoolSubtextSelected,
                  ]}
                >
                  {SCHOOLS[schoolId].name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name (e.g., Yair D.)"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Your Schedule</Text>
          <Text style={styles.hint}>Periods 1-6 are required. Period 0 and 7 are optional.</Text>
          <ScheduleBuilder schedule={schedule} onChange={setSchedule} school={school} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Lunch Schedule</Text>
          <Text style={styles.hint}>Select 1st or 2nd lunch for each day (Wednesday has no lunch periods)</Text>
          {LUNCH_DAYS.map((day) => (
            <View key={day} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{day}</Text>
              <View style={styles.lunchOptions}>
                {LUNCH_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.lunchOption,
                      lunch[day] === opt && styles.lunchSelected,
                    ]}
                    onPress={() => setLunch({ ...lunch, [day]: opt })}
                  >
                    <Text
                      style={[
                        styles.lunchText,
                        lunch[day] === opt && styles.lunchTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio (optional)</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell classmates about yourself..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Contact Info (optional)</Text>
          <Text style={styles.hint}>Paste full links (e.g., https://instagram.com/username)</Text>
          <TextInput
            style={styles.input}
            value={instagram}
            onChangeText={setInstagram}
            placeholder="Instagram link"
            autoCapitalize="none"
            keyboardType="url"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={snapchat}
            onChangeText={setSnapchat}
            placeholder="Snapchat link"
            autoCapitalize="none"
            keyboardType="url"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={tiktok}
            onChangeText={setTiktok}
            placeholder="TikTok link"
            autoCapitalize="none"
            keyboardType="url"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={discord}
            onChangeText={setDiscord}
            placeholder="Discord username"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: Spacing.md }]}>Other Links</Text>
          {otherLinks.map((link, index) => (
            <View key={index} style={styles.otherLinkRow}>
              <TextInput
                style={[styles.input, styles.otherLinkTitle]}
                value={link.title}
                onChangeText={(text) => {
                  const updated = [...otherLinks];
                  updated[index].title = text;
                  setOtherLinks(updated);
                }}
                placeholder="Title (e.g., LinkedIn)"
              />
              <TextInput
                style={[styles.input, styles.otherLinkUrl]}
                value={link.url}
                onChangeText={(text) => {
                  const updated = [...otherLinks];
                  updated[index].url = text;
                  setOtherLinks(updated);
                }}
                placeholder="URL"
                autoCapitalize="none"
                keyboardType="url"
              />
              <TouchableOpacity
                style={styles.removeOtherLink}
                onPress={() => setOtherLinks(otherLinks.filter((_, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addOtherLink}
            onPress={() => setOtherLinks([...otherLinks, { title: '', url: '' }])}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.addOtherLinkText}>Add another link</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (saving || uploading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving || uploading}
        >
          {uploading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <ActivityIndicator color={Colors.textOnPrimary} />
              <Text style={styles.saveButtonText}>Uploading image...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save & Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 56,  // Safe area + spacing
    left: Spacing.md,
    zIndex: 10,
    padding: Spacing.xs,
    minWidth: 44,  // Touch target minimum
    minHeight: 44,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.md,  // 16px screen margins
    paddingTop: 80,  // Space for back button
    paddingBottom: 120,  // Space for floating tab bar
  },
  heading: {
    fontSize: FontSize.xxl,
    fontFamily: Font.extraBold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    lineHeight: FontSize.xxl * 1.2,  // Better line height
  },
  subheading: {
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,  // More breathing room before content
    lineHeight: FontSize.md * 1.5,
  },
  section: {
    marginBottom: Spacing.lg,  // 24px between sections
  },
  label: {
    fontSize: FontSize.md,
    fontFamily: Font.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,  // Tighter spacing between label and input
    lineHeight: FontSize.md * 1.4,
  },
  hint: {
    fontSize: FontSize.sm,  // Slightly larger for readability
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: FontSize.sm * 1.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,  // Consistent with other elements
    paddingHorizontal: Spacing.md,  // 16px internal padding
    paddingVertical: Spacing.sm,    // 12px vertical padding
    fontSize: FontSize.md,
    fontFamily: Font.regular,
    minHeight: 48,  // Touch target comfortable size
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  dayLabel: {
    fontSize: FontSize.sm,
    fontFamily: Font.medium,
    color: Colors.text,
    width: 90,
  },
  lunchOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flex: 1,
  },
  lunchOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minHeight: 44,  // Touch target minimum
    justifyContent: 'center',
  },
  lunchSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  lunchText: {
    fontSize: FontSize.md,
    fontFamily: Font.medium,
    color: Colors.textSecondary,
  },
  lunchTextSelected: {
    color: Colors.primary,
    fontFamily: Font.bold,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,  // More breathing room before CTA
    minHeight: 48,  // Comfortable touch target
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontFamily: Font.bold,
  },
  otherLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  otherLinkTitle: {
    flex: 1,
  },
  otherLinkUrl: {
    flex: 2,
  },
  removeOtherLink: {
    padding: 4,
  },
  addOtherLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  addOtherLinkText: {
    fontSize: FontSize.sm,
    fontFamily: Font.medium,
    color: Colors.primary,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  profilePictureImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureText: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  schoolOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  schoolOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    minHeight: 80,  // Comfortable touch target for important choice
    justifyContent: 'center',
  },
  schoolSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  schoolText: {
    fontSize: FontSize.lg,
    fontFamily: Font.bold,
    color: Colors.textSecondary,
  },
  schoolTextSelected: {
    color: Colors.primary,
  },
  schoolSubtext: {
    fontSize: FontSize.xs,
    fontFamily: Font.regular,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  schoolSubtextSelected: {
    color: Colors.primary,
  },
});
