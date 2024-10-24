import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import { hp, wp } from '@/helpers/common';
import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/Avatar';
import { fetchPosts } from '@/services/postService';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import {
  useTheme as usePaperTheme,
  Button as PaperButton,
  IconButton,
} from 'react-native-paper';
import { translate } from '@/i18n';

var limit = 0;

const Profile = () => {
  const paperTheme = usePaperTheme();
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);

  // TODO Just import this later from SSOT
  const onLogout = async () => {
    // setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert(translate('common:signOut'), translate('errors:signOut'));
    }
  };

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let res = await fetchPosts(limit, user.id);
    console.log(`Post result: ${JSON.stringify(res, null, 2)}`);

    if (res.success) {
      if (posts.length == res.data.length) {
        setHasMore(false);
      }

      setPosts(res.data);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      translate('common:confirm'),
      translate('common:confirmLogout'),
      [
        {
          text: translate('common:cancel'),
          onPress: () => console.log(`canceled`),
          style: 'cancel',
        },
        {
          text: translate('common:logout'),
          onPress: () => onLogout(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <>
            <UserHeader
              user={user}
              router={router}
              handleLogout={handleLogout}
            />
            <View
              style={{
                marginVertical: 20,
                justifyContent: 'center',
                alignSelf: 'center',
                borderBottomColor: paperTheme.colors.onBackground,
                borderBottomWidth: 0.3,
                width: wp(50),
              }}
            />
            <Text style={{ color: paperTheme.colors.secondary }}>
              {translate('profileScreen:myRecentPosts')}
            </Text>
          </>
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        onEndReached={() => {
          getPosts();
          console.log('End reached!');
        }}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text
                style={[
                  styles.noPosts,
                  {
                    color: paperTheme.colors.onBackground,
                  },
                ]}
              >
                {translate('common:endOfList')}
              </Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  const paperTheme = usePaperTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: paperTheme.colors.background,
        paddingHorizontal: wp(4),
      }}
    >
      <View>
        <Header title={translate('common:profile')} showBackButton={true} />
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: paperTheme.colors.error,
            },
          ]}
          onPress={handleLogout}
        >
          <Icon name={'logout'} color={paperTheme.colors.onError} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={[
                styles.editIcon,
                {
                  shadowColor: paperTheme.colors.shadow,
                },
              ]}
              onPress={() => router.push('/editProfile')}
            >
              {/* name: edit */}
              <Icon name='userEdit' strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text
              style={[
                styles.username,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {user && user.name}
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: paperTheme.colors.onSurface,
                },
              ]}
            >
              {user && user.address}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              {/* name mail */}
              <Icon name='email' color={paperTheme.colors.secondary} />
              <Text
                style={[
                  styles.infoText,
                  { color: paperTheme.colors.onBackground },
                ]}
              >
                {user && user.email}
              </Text>
            </View>
            {user && user?.phoneNumber && (
              <View style={styles.info}>
                {/* name call/phone */}
                <Icon name='phone' color={paperTheme.colors.secondary} />
                <Text
                  style={[
                    styles.infoText,
                    { color: paperTheme.colors.onBackground },
                  ]}
                >
                  {user && user.phoneNumber}
                </Text>
              </View>
            )}
            {user && user?.bio && (
              <Text
                style={[
                  styles.infoText,
                  { color: paperTheme.colors.onBackground },
                ]}
              >
                {user && user.bio}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },

  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    // color: theme.colors.text,
    fontSize: hp(3.2),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    // borderColor: theme.colors.gray,
    borderWidth: 3,
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: hp(3),
    fontWeight: '500',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
});
