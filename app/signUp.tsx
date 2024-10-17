import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { Link, router, useRouter } from 'expo-router';
import Icon from '../assets/icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/BackButton';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const nameRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert(
        'Sign Up',
        'Please fill all the fields in order to create your account'
      );
    }

    // cleared to run
    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    setLoading(false);

    console.log(`session: ${JSON.stringify(session, null, 2)}`);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);

    if (error) {
      Alert.alert('Sign up', error.message);
    }
  };

  return (
    <ScreenWrapper bg='white'>
      <StatusBar style='dark' />
      <View style={styles.container}>
        <BackButton router={router} />

        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill in all details to create your own account
          </Text>
          <Input
            icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            placeholder='Enter your name'
            onChangeText={(value: string) => (nameRef.current = value)}
          />
          <Input
            icon={<Icon name='email' size={26} strokeWidth={1.6} />}
            placeholder='Enter your email'
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name='lockPassword' size={26} strokeWidth={1.6} />}
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          <Text style={styles.forgotPassword}>Forgot password?</Text>
          <Button title='Sign Up' loading={loading} onPress={onSubmit} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text
              style={[
                styles.footerText,
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
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  textHeader: { fontSize: 42 },
  welcomeText: {
    fontSize: hp(4),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
