import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import Button from '@/components/Button';

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper bg='#fff'>
      <StatusBar style='dark' />
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://unsplash.it/400' }}
          style={styles.welcomeImage}
          resizeMode='contain'
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Strands</Text>
          <Text style={styles.punchline}>
            We want to give you one place to share details about your clients
            like what their hair responds best to, and success and pitfalls you
            may have had with them!
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title='Getting Started'
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push('/signUp')}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text
                style={[
                  styles.loginText,
                  // @ts-ignore
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: wp(4),
  },
  textHeader: { fontSize: 42 },
  welcomeImage: { height: hp(30), width: wp(100), alignSelf: 'center' },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    // theme.fonts.extraBold
    fontWeight: '800',
  },
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: { gap: 30, width: '100%' },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
