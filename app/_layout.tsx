import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';
import { PaperProvider as PaperThemeProvider } from 'react-native-paper';

/* 
 ERROR  Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead. */
LogBox.ignoreLogs([
  'Warning: TNodeChildrenRenderer',
  'Warning: MemoizedTNodeRenderer',
  'Warning: TRenderEngineProvider',
]);
const _layout = () => {
  return (
    <AuthProvider>
      <PaperThemeProvider>
        <MainLayout />
      </PaperThemeProvider>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_auth, session) => {
      console.log(`session.user: ${JSON.stringify(session?.user.id, null, 2)}`);

      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });
  }, []);

  const updateUserData = async (user: Record<string, any>, email: string) => {
    let res = await getUserData(user?.id);

    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='(main)/postDetails'
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
};

export default _layout;
