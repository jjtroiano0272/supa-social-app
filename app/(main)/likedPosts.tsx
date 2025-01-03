import RenderHtml from "react-native-render-html";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  List,
  MD3Theme,
  useTheme,
  useTheme as usetheme,
  withTheme,
} from "react-native-paper";
import { wp, hp } from "@/helpers/common";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { myTheme } from "@/constants/theme";
import { fetchUsersLikedPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Avatar from "@/components/Avatar";
import { Image } from "react-native";
import { getSupabaseFileUrl } from "@/services/imageService";
import Loading from "@/components/Loading";
import { translate } from "@/i18n";

var limit = 0;

const likedPosts = () => {
  const theme = useTheme();
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<[{ [key: string]: any }] | []>(
    []
  );
  const router = useRouter();

  const textStyle = {
    color: theme.colors.onBackground,
    fontSize: hp(1.75),
  };

  const tagsStyle = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: { color: theme.colors.onBackground },
    h4: { color: theme.colors.onBackground },
  };

  const getLikedPosts = async () => {
    if (!hasMore) {
      return null;
    }
    limit = limit + 10;

    let res = await fetchUsersLikedPosts(limit, user?.id);

    console.log(`res in getLikedPosts: ${JSON.stringify(res, null, 2)}`);

    if (res?.success) {
      if (likedPosts?.length == res?.data?.length) {
        setHasMore(false);
      }

      setLikedPosts(res?.data);
    }
  };

  useEffect(() => {
    console.log(`likedPosts: ${JSON.stringify(likedPosts, null, 2)}`);
  }, [likedPosts]);

  return (
    <ScreenWrapper>
      <FlatList
        data={likedPosts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        onEndReached={() => getLikedPosts()}
        keyExtractor={(item: any) => item?.id?.toString()}
        renderItem={({ item, index }) => (
          //   <List.Item
          //     // onPress={() => console.log('go to unblock user')}
          //     key={index}
          //     title={item?.user.name}
          //     description={
          //       <View>
          //         {item?.body && (
          //           <RenderHtml
          //             contentWidth={wp(100)}
          //             source={{ html: item?.body }}
          //             tagsStyles={tagsStyle}
          //           />
          //         )}
          //       </View>
          //     }
          //     left={(props) => (
          //       <Avatar
          //         size={hp(4.5)}
          //         uri={item?.user?.image}
          //         rounded={theme.radius.md}
          //       />
          //     )}
          //     right={(props) => (
          //       <Image
          //         source={getSupabaseFileUrl(item?.file?.[0]) as { uri: any }}
          //         height={100}
          //         width={100}
          //       />
          //     )}
          //   />

          //   TODO For later, allow it to navgiate to...gonna be too complcated for now
          <PostCard
            key={item.id}
            item={item}
            currentUser={user}
            router={router}
            interactable={false}
          />
        )}
        // ListHeaderComponent={
        //   <View
        //     style={{
        //       flex: 1,
        //       backgroundColor: theme.colors.background,
        //       paddingHorizontal: wp(4),
        //     }}
        //   >
        //     <View>
        //       <Header
        //         title={translate("likedPostsScreen:title")}
        //         showBackButton
        //       />
        //     </View>
        //   </View
        ListHeaderComponent={
          <View
            style={{
              flex: 1,
              marginBottom: 30,
              paddingHorizontal: wp(4),
              gap: 15,
            }}
          >
            <Header
              title={translate("likedPostsScreen:title")}
              showBackButton
            />
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View
              style={{ marginVertical: likedPosts?.length == 0 ? 100 : 30 }}
            >
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text
                style={[
                  styles.noPosts,
                  {
                    color: theme.colors.onBackground,
                  },
                ]}
              >
                {translate("common:endOfList")}
              </Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

export default likedPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(3.2),
    // fontWeight: theme.fontWeight.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    // borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    // borderColor: theme.colors.gray,
    borderWidth: 3,
  },

  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    // paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pillText: {
    fontSize: hp(1.2),
    // fontWeight: theme.fontWeight.bold,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  maskedView: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    overflow: "hidden",
  },
  mask: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "black",
  },

  circleMask: {
    borderRadius: 25,
    overflow: "hidden",
  },
  mainImage: {
    width: 50,
    height: 50,
  },
  catImageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 10,
    overflow: "hidden",
  },
  catImageMask: {
    borderRadius: 10,
    overflow: "hidden",
    width: 20,
    height: 20,
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
});
