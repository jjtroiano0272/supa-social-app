import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';
import { PaperProvider as PaperThemeProvider } from 'react-native-paper';
// import * as i18n from '@/i18n';
// import i18next from 'i18next';
import { initI18n } from '@/i18n';

// i18next.init({
//   fallbackLng: 'en',
//   resources: {
//     en: {
//       translation: {
//         key: 'hello world',
//       },
//     },
//   },
// });

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
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nInitialized(true));
    // .then(() => loadDateFnsLocale());
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_auth, session) => {
      if (session && session?.user?.email) {
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
      {/* TODO */}
      {/* <Stack.Screen
        name='(main)/confirmDeleteAccount'
        options={{ presentation: 'modal' }}
      /> */}
    </Stack>
  );
};

export default _layout;
