import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import Avatar from '@/components/Avatar';
import RichTextEditor from '@/components/RichTextEditor';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/assets/icons';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { getSupabaseFileUrl } from '@/services/imageService';
import { Video } from 'expo-av';
import { createOrUpdatePost } from '@/services/postService';
import { useTheme as usePaperTheme } from 'react-native-paper';
import Input from '@/components/Input';
import Picker from '@/components/Picker';
import { translate } from '@/i18n';

const NewPost = () => {
  const paperTheme = usePaperTheme();
  const post = useLocalSearchParams();
  console.log(`post (loalSearchParams): ${JSON.stringify(post, null, 2)}`);
  const { user } = useAuth();
  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const clientNameRef = useRef('');
  const formulaDescriptionRef = useRef('');
  const formulaTypeRef = useRef('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<
    ImagePicker.ImagePickerAsset | null | undefined
  >();

  const richText = React.useRef();

  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post.body;
      setFile(post.file || null);

      setTimeout(() => {
        editorRef?.current?.setContentHTML(post.body);
      }, 300);
    }
  }, []);
  const onPick = async (isImage: boolean) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        ...mediaConfig,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };
  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert(
        translate('common:post'),
        translate('newPostScreen:chooseSomeMedia')
      );
      return;
    }
    console.log(`body: ${JSON.stringify(bodyRef.current, null, 2)}`);
    console.log(`file: ${JSON.stringify(file, null, 2)}`);

    let data = {
      file,
      body: bodyRef?.current,
      client_name: clientNameRef?.current,
      formula_info: {
        formula_type: formulaTypeRef?.current,
        formula_description: formulaDescriptionRef?.current,
      },
      userId: user?.id,
    };

    if (post && post?.id) data.id = post.id;

    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);

    console.log(`post res: ${JSON.stringify(res, null, 2)}`);

    if (res.success) {
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      clientNameRef.current = '';
      router.back();
    } else {
      Alert.alert('Post', res.msg);
    }
  };

  const isLocalFile = (file: any) => {
    if (!file) return null;
    if (typeof file == 'object') return true;

    return false;
  };

  const getFileType = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes('postImages')) {
      return 'image';
    }

    return 'video';
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={translate('newPostScreen:title')} />
        <ScrollView
          contentContainerStyle={{ gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* avatar */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
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
                {user && user.name}
              </Text>
              <Text
                style={[
                  styles.publicText,
                  {
                    color: paperTheme.colors.secondary,
                  },
                ]}
              >
                {translate('common:public')}
              </Text>
            </View>
          </View>

          <Input
            autoCapitalize='words'
            icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            placeholder={translate('common:clientName')}
            onChangeText={(value: string) => (clientNameRef.current = value)}
          />

          {/* formula type */}
          <Input
            // icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            autoCapitalize='words'
            placeholder={translate('newPostScreen:formulaTypePlaceholder')}
            onChangeText={(value: string) => (formulaTypeRef.current = value)}
          />
          {/* formula description */}
          <Input
            // icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            autoCapitalize='words'
            placeholder={translate(
              'newPostScreen:formulaDescriptionPlaceholder'
            )}
            onChangeText={(value: string) =>
              (formulaDescriptionRef.current = value)
            }
          />

          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={body => (bodyRef.current = body)}
            />
          </View>

          {file && (
            <View style={styles.file}>
              {getFileType(file) == 'video' ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  useNativeControls
                  resizeMode='cover'
                  isLooping
                />
              ) : (
                <Image
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  resizeMode='cover'
                />
              )}
              <Pressable style={styles.closelcon} onPress={() => setFile(null)}>
                <Icon name='delete' size={20} color='white' />
              </Pressable>
            </View>
          )}

          <View
            style={[
              styles.media,
              {
                borderColor: paperTheme.colors.outline,
              },
            ]}
          >
            <Text
              style={[
                styles.addImageText,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {translate('newPostScreen:addToPost')}
            </Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon
                  name='image'
                  size={30}
                  color={paperTheme.colors.onBackground}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon
                  name='video'
                  size={33}
                  color={paperTheme.colors.onBackground}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Button
          buttonStyle={{ height: hp(6.2) }}
          title={
            post && post.id
              ? translate('common:update')
              : translate('common:postActionButton')
          }
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  textHeader: { fontSize: 42 },

  title: {
    // marginBottom: 10,
    fontSize: hp(2.5),
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
    // color: theme.colors.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  publicText: {
    fontSize: hp(1.7),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  textEditor: {
    // marginTop: 10
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.9),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  imageIcon: {
    // backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    // padding: 6,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  video: {},
  closelcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadow0pacity: 0.6,
    // shadowRadius:
  },
});
