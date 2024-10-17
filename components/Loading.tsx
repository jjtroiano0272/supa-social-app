import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { theme } from '@/constants/theme';

const Loading = ({
  size = 'large',
  color = theme.colors.primary,
}: {
  size?: number | 'large' | 'small' | undefined;
  color?: string;
}) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
});
