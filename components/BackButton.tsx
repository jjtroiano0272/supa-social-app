import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';

const BackButton = ({ size = 26, router }: any) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon
        name='arrowLeft'
        strokeWidth={2.6}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },
  button: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.7',
  },
});

