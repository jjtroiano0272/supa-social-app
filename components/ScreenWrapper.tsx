import { StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({
  children,
  bg,
}: {
  children: ReactNode;
  bg?: string;
}) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>{children}</View>
  );
};

export default ScreenWrapper;
