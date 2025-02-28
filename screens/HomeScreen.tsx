import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import BellIcon from "../assets/icons/BellIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import UserIcon from "../assets/icons/UserIcon";
import { wp, hp } from "../helpers/common";
import { useNavigation } from "@react-navigation/native";
import Avatar from "../components/Avatar";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { fetchPost } from "@/service/postService";
import PostCard from "../components/PostCard";
import LottieView from "lottie-react-native";
import { getUserData } from "@/service/userService";

var limit = 0;

const HomeScreen = () => {
  // <Button title="Logout" onPress={handleLogout} />
  const navigation = useNavigation();
  const { setUser, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [boom,setBoom] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
  };

  const handleBoom = () =>{
    setBoom(!boom)
  }

  const handlePostEvent = async (payload) => {
    // console.log("got post data", payload);
    if(payload.eventType=='DELETE' && payload?.old?.id){
      setPosts(prevPosts=>{
        let updatedPosts = prevPosts.filter(post=>post.id!=payload.old.id)
        return updatedPosts
      })
    }
  };

  const handleNewNotification = async(payload) =>{
    // console.log("New notification received:", payload);
    if(payload.eventType=='INSERT' && payload.new.id){
      setNotificationCount(prev=>prev+1)
    }
  }

  useEffect(() => {
    if (!user || !user.id) return;

    // console.log(user.id);
    getUserData(user.id).then((url) => setImageUrl(url));
    

    let postsChannel;
    let notificationChannel;
  
    postsChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        handlePostEvent
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();
  
    notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user.id}`,
        },
        handleNewNotification
      )
      .subscribe();
  
    return () => {
      if (postsChannel) supabase.removeChannel(postsChannel);
      if (notificationChannel) supabase.removeChannel(notificationChannel);
    };
  }, [user?.id]);
  

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    console.log(limit);

    let res = await fetchPost(limit);
    // console.log('get posts result: ',res);
    // console.log(res.data[0].users.name);
    if (res.success) {
      if (posts.length == res.data?.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="white" barStyle={"dark-content"} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBoom}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: hp(3),
              fontFamily: "cursive",
              color:boom ? "#ff3f05" : "black"
            }}
          >
            NetFriends
            
          </Text>
          {boom && <LottieView
                source={require("../assets/images/fire.json")}
                autoPlay
                loop
                style={styles.fire}
              />}
        </TouchableOpacity>

        

        <View style={styles.iconHeader}>
          <Pressable
            style={{ paddingHorizontal: wp(3) }}
            onPress={() => navigation.navigate("Notification")}
          >
            <BellIcon />

            {
              notificationCount>0 && (
                <View>
                  <Text>{notificationCount}</Text>
                </View>
              )
            }
            
          </Pressable>
          <Pressable
            style={{ paddingHorizontal: wp(3) }}
            onPress={() => navigation.navigate("NewPost")}
          >
            <PlusIcon />
          </Pressable>
          <Pressable
            style={{ paddingHorizontal: wp(3) }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Avatar
              uri={user?.image}
              size={hp(4)}
              style={{ borderWidth: 2, borderRadius: 50 }}
            />
          </Pressable>
        </View>
      </View>

      {/* posts */}
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            currentUser={user}
            imageUrl={imageUrl}
            // router={router}
          />
        )}
        onEndReached={() => {
          getPosts();
        }}
        ListFooterComponent={
          hasMore ? (
            <View style={{ alignItems: "center" }}>
              <LottieView
                source={require("../assets/images/loading.json")}
                autoPlay
                loop
                style={styles.loader}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.noPosts}>No more Posts</Text>
            </View>
          )
        }
      />

      <ScrollView></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: hp(1.5),
    alignItems: "center",
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  loader: { width: 150, height: 150 },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: "gray",
    marginBottom: hp(2),
  },
  fire:{
    position:'absolute',
    top:-50,
    left:-30,
    width:150,
    height:150
  }
});

export default HomeScreen;
