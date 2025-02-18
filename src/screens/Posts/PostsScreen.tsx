import { FC, useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { NavRoutes, NavigatorProps } from "../../types/navigation";
import { colors } from "../../styles/global";
import { styles } from "./PostsScreenStyles";
import Placeholder from "../../components/Placeholder";
import { AVATAR_IMG } from "../../variables";
import { getPosts } from "../../utils/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../types/auth";
import { PostFB } from "../../types/posts";
import { useFocusEffect } from "@react-navigation/native";

const PostsScreen: FC<NavigatorProps> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [posts, setPosts] = useState<PostFB[]>([]);

  const getPostsData = async () => {
    const postsData = await getPosts(user.uid);
    setPosts(postsData);
  };

  useFocusEffect(
    useCallback(() => {
      getPostsData();
    }, [])
  );

  return (
    <View style={styles.postsContainer}>
      <View style={styles.userContainer}>
        <Image
          style={styles.avatarPhoto}
          source={user.photo ? { uri: user.photo } : AVATAR_IMG}
          resizeMode="cover"
        />
        <View style={styles.userData}>
          <Text style={styles.userName}>{user.login}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View>
        {posts.length === 0 && (
          <Placeholder
            text={"There are no posts. You can add a new one."}
            route={NavRoutes.CreatePost}
            icon="add"
          />
        )}
        <FlatList
          data={posts}
          keyExtractor={(item, indx) => indx.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 24 }}></View>}
          renderItem={({ item }) => (
            <View>
              {item?.photo && (
                <Image style={styles.postPhoto} source={{ uri: item.photo }} />
              )}
              <Text style={styles.postTitle}>{item.title}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => navigation.navigate(NavRoutes.Comments)}
                >
                  <Feather
                    name="message-circle"
                    size={24}
                    color={colors.text_gray}
                  />
                  <Text style={styles.count}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(NavRoutes.Map, {
                      latitude: item.location?.latitude,
                      longitude: item.location?.longitude,
                    })
                  }
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Feather name="map-pin" size={24} color={colors.text_gray} />
                  <Text style={styles.place}>{item.place}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default PostsScreen;
