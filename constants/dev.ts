// Development mode configuration
// This is now controlled in-app by the developer (Yair Donenfeld)
export const DEV_MODE = false; // Not used anymore - controlled per-user

// Developer account - only this account has access to dev menu
export const DEVELOPER_NAME = 'Yair Donenfeld';

// Choose which screen to test:
// 'login' - See login screen (no user, no profile)
// 'onboarding' - See setup screen (has user, no profile)
// 'app' - See main app (has user and complete profile)
export const DEV_SCREEN: 'login' | 'onboarding' | 'app' = 'app';

// Mock user data for development
export const MOCK_USER = {
  uid: 'dev-user-123',
  email: 'dev@studysync.test',
  displayName: 'Dev User',
};

export const MOCK_PROFILE = {
  uid: 'dev-user-123',
  displayName: 'Alex Developer',
  school: 'jhs' as const,
  profilePicture: undefined,
  lunch: {
    Monday: '1st' as const,
    Tuesday: '2nd' as const,
    Thursday: '1st' as const,
    Friday: '2nd' as const,
  },
  bio: 'This is a mock profile for development',
  contacts: {
    instagram: 'https://instagram.com/dev',
    discord: 'DevUser#1234',
  },
  schedule: {
    '1': { subject: 'Algebra 2', teacher: 'Eric Carlson' },
    '2': { subject: 'English 10', teacher: 'Todd Benedict' },
    '3': { subject: 'Chemistry in the Earth System', teacher: 'Michael Bailey' },
    '4': { subject: 'AP US History', teacher: 'Steve Bennett' },
    '5': { subject: 'Family Health', teacher: 'Lesley Crawford' },
    '6': { subject: 'Spanish 2', teacher: 'Elmer Delgado' },
  },
  createdAt: Date.now(),
};
