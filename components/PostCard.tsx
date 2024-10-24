import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  Touchable,
  Alert,
  Share,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { hp, stripHtmlTags, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import { downloadFile, getSupabaseFileUrl } from '@/services/imageService';
import { Video } from 'expo-av';
import { createPostLike, removePostLike } from '@/services/postService';
import Loading from './Loading';
import { useTheme as usePaperTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { translate } from '@/i18n';

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}: any) => {
  const paperTheme = usePaperTheme();

  const textStyle = {
    color: paperTheme.colors.onBackground,
    fontSize: hp(1.75),
  };

  const tagsStyle = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: { color: paperTheme.colors.onBackground },
    h4: { color: paperTheme.colors.onBackground },
  };

  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const created_at = moment(item?.created_at).format('MMM D');
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const openPostDetails = () => {
    if (!showMoreIcon) return null;

    router.push({
      pathname: '/postDetails',
      params: {
        postId: item?.id,
      },
    });
  };

  const onLike = async () => {
    // Remove like if it's already been liked, otherwise like the post
    if (liked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      let updatedLikes = likes.filter(like => like.userId != currentUser?.id);

      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log(`removed like res: ${JSON.stringify(res, null, 2)}`);

      if (!res.success) Alert.alert('Post', 'Could not unlike post!');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let data = { userId: currentUser?.id, postId: item?.id };

      setLikes([...likes, data]);
      let res = await createPostLike(data);
      console.log(`postLike res: ${JSON.stringify(res, null, 2)}`);

      if (!res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Post', 'Something went wrong!');
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to do this?', [
      {
        text: 'Cancel',
        onPress: () => console.log(`canceled`),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete(item),
        style: 'destructive',
      },
    ]);
  };

  const handleCopyFormula = async (str: string, type?: 'partial') => {
    try {
      await Clipboard.setStringAsync(str);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // setTextCopied(true);
      // setTimeout(() => {
      //   setTextCopied(false);
      // }, 1000);
    } catch (error) {
      console.error(`some error in handleCopyItem: ${error}`);
      return null;
    }
  };

  const liked = likes.filter(like => like.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: paperTheme.colors.background,
          borderColor: paperTheme.colors.secondary,
        },
        hasShadow && shadowStyles,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text
              style={[
                styles.username,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {item?.user?.name || '[deleted]'}
            </Text>
            <Text
              style={[
                styles.postTime,
                {
                  color: paperTheme.colors.secondary,
                },
              ]}
            >
              {created_at}
            </Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name='moreHorizontal'
              size={hp(3.4)}
              strokeWidth={3}
              color={paperTheme.colors.onBackground}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon
                name='edit'
                size={hp(2.5)}
                color={paperTheme.colors.onBackground}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon
                name='delete'
                size={hp(2.5)}
                color={paperTheme.colors.error}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post details */}
      <Pressable style={styles.content} onPress={openPostDetails}>
        <View style={styles.postBody}>
          {/* Client's name */}
          {item?.client_name && (
            <Text
              // @ts-ignore
              style={{
                color: paperTheme.colors.secondary,
                fontWeight: theme.fonts.semibold,
                marginVertical: 10,
              }}
            >
              {`>>`} {translate('homeScreen:clientName')}: {item.client_name}
            </Text>
          )}

          {/* Client formula, as chips or cards?...discrete data */}
          {item?.formula_info &&
            item?.formula_info.formula_type &&
            item?.formula_info.formula_description && (
              <Pressable
                style={{
                  backgroundColor: paperTheme.colors.elevation.level2,
                  borderRadius: theme.radius.md,
                  padding: 12,
                  marginBottom: 5,
                }}
                onPress={() =>
                  handleCopyFormula(item.formula_info.formula_description)
                }
              >
                <Text
                  // @ts-ignore
                  style={{
                    color: paperTheme.colors.secondary,
                    fontWeight: theme.fonts.semibold,
                  }}
                >
                  {item.formula_info?.formula_type.toUpperCase()}
                </Text>

                {item.formula_info?.formula_description && (
                  <View style={{ left: 15 }}>
                    {item.formula_info?.formula_description
                      ?.split('+')
                      .map((x: string, index: number) => (
                        <Text
                          key={index}
                          // @ts-ignore
                          style={{
                            color: paperTheme.colors.secondary,
                            fontWeight: theme.fonts.medium,
                          }}
                        >
                          {x.trim()}
                        </Text>
                      ))}
                  </View>
                )}
              </Pressable>
            )}

          {/* Details about client */}
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyle}
            />
          )}
        </View>
      </Pressable>

      {/* post image */}
      {item?.file && item?.file?.includes('postImages') && (
        <Pressable onPress={openPostDetails}>
          <Image
            source={getSupabaseFileUrl(item?.file)!}
            transition={100}
            style={styles.postMedia}
            contentFit='cover'
          />
        </Pressable>
      )}
      {/* post video */}
      {item?.file && item?.file?.includes('postVideos') && (
        <Pressable onPress={openPostDetails}>
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={getSupabaseFileUrl(item?.file)}
            useNativeControls
            resizeMode='cover'
            isLooping
          />
        </Pressable>
      )}

      {/* likeables */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name='heart'
              size={24}
              fill={liked ? paperTheme.colors.error : 'transparent'}
              color={
                liked ? paperTheme.colors.error : paperTheme.colors.secondary
              }
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.count,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {likes.length}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name='comment'
              size={24}
              color={paperTheme.colors.secondary}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.count,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {item?.comments[0]?.count}
          </Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size={'small'} />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon
                name='share'
                size={24}
                color={paperTheme.colors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    borderWidth: 0.5,
    shadowColor: '#000',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
    // marginBottom: 10,
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  count: {
    fontSize: hp(1.8),
  },
});
