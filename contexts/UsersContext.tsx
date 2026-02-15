import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSchoolUsers, UserProfile } from '../lib/store';

interface UsersContextType {
  allUsers: UserProfile[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType>({
  allUsers: [],
  loading: true,
  refresh: async () => {},
});

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (profile?.school) {
      setLoading(true);
      const users = await getSchoolUsers(profile.school);
      setAllUsers(users);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.school) {
      refresh();
    }
  }, [profile?.school]);

  return (
    <UsersContext.Provider value={{ allUsers, loading, refresh }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
