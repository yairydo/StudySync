import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { SchoolId } from '../constants/schedule';

export interface ScheduleEntry {
  subject: string;
  teacher: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  school: SchoolId;
  profilePicture?: string; // Firebase Storage URL
  lunch: Record<string, '1st' | '2nd'>; // per-day lunch schedule
  bio: string;
  contacts: {
    instagram?: string;
    discord?: string;
    snapchat?: string;
    tiktok?: string;
    phone?: string;
    other?: Array<{ title: string; url: string }>;
  };
  schedule: Record<string, ScheduleEntry>;
  createdAt?: number;
}

// Get a single user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

// Create or update user profile
export async function saveUserProfile(uid: string, data: Partial<UserProfile>) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, data);
  } else {
    await setDoc(ref, { ...data, createdAt: Date.now() });
  }
}

// Get all users from a school (cached client-side for filtering)
export async function getSchoolUsers(school: string): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), where('school', '==', school));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile);
}

// Get students who share a specific class (period + subject + teacher)
export async function getClassmates(
  school: string,
  period: string,
  subject: string,
  teacher: string
): Promise<UserProfile[]> {
  // Firestore can't do nested field queries easily with dynamic keys,
  // so we fetch all school users and filter client-side
  const users = await getSchoolUsers(school);
  return users.filter((u) => {
    const entry = u.schedule?.[period];
    return entry && entry.subject === subject && entry.teacher === teacher;
  });
}

// Count classmates for each period in a user's schedule
export function countClassmates(
  currentUser: UserProfile,
  allUsers: UserProfile[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [period, entry] of Object.entries(currentUser.schedule || {})) {
    counts[period] = allUsers.filter((u) => {
      if (u.uid === currentUser.uid) return false;
      const their = u.schedule?.[period];
      return their && their.subject === entry.subject && their.teacher === entry.teacher;
    }).length;
  }
  return counts;
}

// Find students sharing specific classes (multi-filter)
export function findSharedStudents(
  currentUser: UserProfile,
  allUsers: UserProfile[],
  selectedPeriods: string[],
  sameLunchOnly: boolean
): UserProfile[] {
  return allUsers.filter((u) => {
    if (u.uid === currentUser.uid) return false;
    if (sameLunchOnly) {
      // Check if they share lunch on any day
      const hasSharedLunch = Object.keys(currentUser.lunch || {}).some(
        (day) => currentUser.lunch[day] === u.lunch?.[day]
      );
      if (!hasSharedLunch) return false;
    }
    return selectedPeriods.every((period) => {
      const mine = currentUser.schedule?.[period];
      const theirs = u.schedule?.[period];
      return mine && theirs && mine.subject === theirs.subject && mine.teacher === theirs.teacher;
    });
  });
}

// Check if two users share lunch on any day
export function hasSharedLunch(userA: UserProfile, userB: UserProfile): boolean {
  return Object.keys(userA.lunch || {}).some(
    (day) => userA.lunch[day] === userB.lunch?.[day]
  );
}

// Count shared classes between two users
export function countSharedClasses(userA: UserProfile, userB: UserProfile): number {
  let count = 0;
  for (const [period, entry] of Object.entries(userA.schedule || {})) {
    const other = userB.schedule?.[period];
    if (other && other.subject === entry.subject && other.teacher === entry.teacher) {
      count++;
    }
  }
  return count;
}
