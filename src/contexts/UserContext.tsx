'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

type UserContextType = {
  user: UserProfile | null;
  isLoadingUser: boolean;
  can: (permissionName: string) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type Role = {
  name: string;
  description: string;
};

type UserProfile = User & {
  roles?: Role;
  full_name?: string;
  permissions?: string[];
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // once use for all pages
  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('full_name, roles!inner(name, description)')
          .eq('id', user.id)
          .single();

        const { data: permissionsData } = await supabase.rpc(
          'get_user_permissions',
          { p_user_id: user.id }
        );

        const permissions =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          permissionsData?.map((p: any) => p.permission_name) || [];

        if (error) {
          console.error('Error mengambil data profile:', error);
        }

        setUser({
          ...user,
          full_name: profile?.full_name,
          roles: profile?.roles as Role | undefined,
          permissions: permissions,
        });
      } else {
        setUser(null);
      }
      setIsLoadingUser(false);
    };

    getUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in, refetching data...');
        getUserData();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state...');
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const can = (permissionName: string): boolean => {
    if (!user) return false;
    if (user.roles?.name === 'administrator') return true;

    return user.permissions?.includes(permissionName) ?? false;
  };

  const value = {
    user,
    isLoadingUser,
    can,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// read context easily
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    return {
      user: null,
      permissions: [],
      isAdministrator: false,
      can: () => false,
      isLoadingUser: false,
    };
  }

  return context;
};
