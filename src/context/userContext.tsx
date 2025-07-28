import { defineAbilityFor } from '@/casl/ability';
import { AbilityContext } from '@/casl/Can';
import axios from 'axios';
import React, { useState, createContext, ReactNode, useEffect } from 'react';

export const UserContext = createContext<{
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}>({
  user: {} as any,
  setUser: () => {},
});

interface UserContextProps {
  children: ReactNode;
}

export function UserContextComponent({ children }: UserContextProps) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/whoami`,
        { withCredentials: true },
      );
      if (res.data.isLogin) {
        setUser(res.data.dataUser);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AbilityContext.Provider value={defineAbilityFor([])}>
        {children}
      </AbilityContext.Provider>
    </UserContext.Provider>
  );
}
