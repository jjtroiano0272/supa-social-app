import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import Button from '@/components/Button';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { translate } from '@/i18n';

const Welcome = () => {
  const paperTheme = usePaperTheme();
  const router = useRouter();

  return (
    <ScreenWrapper>
      {/* <StatusBar style='dark' /> */}
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/strands-logo-2-square.png')}
          style={styles.welcomeImage}
          resizeMode='contain'
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text
            style={[
              styles.title,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {/* common.appName */}
            Strands
          </Text>
          <Text
            style={[
              styles.punchline,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {translate('welcomeScreen:missionStatement')}
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title={translate('welcomeScreen:gettingStarted')}
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push('/signUp')}
          />
          <View style={styles.bottomTextContainer}>
            <Text
              style={[
                styles.loginText,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {translate('common:alreadyHaveAccount')}
            </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text
                style={[
                  styles.loginText,
                  // @ts-ignore
                  {
                    color: paperTheme.colors.onBackground,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                {translate('common:loginText')}
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
    // backgroundColor: '#fff',
    paddingHorizontal: wp(4),
  },
  textHeader: { fontSize: 42 },
  welcomeImage: { height: hp(30), width: wp(100), alignSelf: 'center' },
  title: {
    fontSize: hp(4),
    textAlign: 'center',
    // theme.fonts.extraBold
    fontWeight: '800',
  },
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
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
    fontSize: hp(1.6),
  },
});
