import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  StatusBar,
  FlatList,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import BackButton from "../assets/icons/BackButton";
import { wp, hp } from "../helpers/common";
import { useNavigation } from "@react-navigation/native";
import Logout from "../assets/icons/Logout";
import Avatar from "@/components/Avatar";
import EditIcon from "@/assets/icons/EditIcon";
import MailIcon from "@/assets/icons/MailIcon";
import { supabase } from "../lib/supabase";
import LottieView from "lottie-react-native";
import { fetchPost, fetchUserById } from "@/service/postService";
import PostCard from "@/components/PostCard";
import { ScrollView } from "react-native-gesture-handler";

function Profile() {
  const navigation = useNavigation();
  const { setAuth, user, setUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(10); // Fixed limit as state

  // Handle logout functionality
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Reset user state
    navigation.navigate("Welcome");
  };

  // Fetch user details from database
  useEffect(() => {
    fetchUserDetails();
    getPosts();
  }, [user]); // Added dependency array to prevent infinite re-renders

  const fetchUserDetails = async () => {
    if (!user?.id) return; // Ensure user is logged in

    try {
      const { data, error } = await supabase
        .from("users") // Ensure correct table name
        .select("name, address, phoneNumber, bio")
        .eq("id", user.id) // Match by user ID
        .single(); // Expect a single record

      if (error) {
        console.error("Error fetching user details:", error.message);
      } else {
        setUserData(data); // Store data in state
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  // Fetch posts for the user
  const getPosts = async () => {
    if (!hasMore) return;
    setLimit((prev) => prev + 10); // Update limit dynamically

    try {
      let res = await fetchPost(limit, user.id);

      if (res.success) {
        if (posts.length === res.data.length) setHasMore(false);
        setPosts(res.data);
      } else {
        console.error("Error fetching posts:", res.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <FlatList
        data={posts}
        scrollEnabled
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard item={item} currentUser={user} />}
        ListHeaderComponent={
          <View>
            <View style={styles.container}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <BackButton size={wp(6)} color="white" />
              </Pressable>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: hp(3),
                  fontFamily: "cursive",
                }}
              >
                Profile
              </Text>
              <Pressable style={{ marginRight: 20 }} onPress={handleLogout}>
                <Logout />
              </Pressable>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image}
                size={hp(12)}
                style={{ borderRadius: 30 }}
              />
              <View style={styles.editIconContainer}>
                <Pressable onPress={() => navigation.navigate("EditProfile")}>
                  <EditIcon />
                </Pressable>
              </View>
            </View>

            {/* User Info */}
            <View style={{ margin: 10, alignItems: "center" }}>
              <Text style={styles.userName}>
                {userData?.name || "Your Name"}
              </Text>
              <Text style={styles.userAddress}>
                {userData?.address || "India"}
              </Text>
            </View>

            {/* Email, Phone, and Bio Section */}
            <View style={{ marginHorizontal: 20 }}>
              <View style={styles.infoRow}>
                <MailIcon />
                <Text style={styles.infoText}>
                  {user.email || "Not Provided"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={{ fontWeight: "bold" }}>📞 </Text>
                <Text style={styles.infoText}>
                  {userData?.phoneNumber || "Not Provided"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={{ fontWeight: "bold" }}>📝 </Text>
                <Text style={styles.infoText}>
                  {userData?.bio || "No bio available"}
                </Text>
              </View>
            </View>
          </View>
        }
        initialNumToRender={1} // Ensure initial rendering
        onEndReached={getPosts} // Trigger fetching on scroll
        onEndReachedThreshold={0.5} // Load more when 50% scrolled
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
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#ed0581",
    borderRadius: wp(3),
    padding: wp(2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    margin: hp(2),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(1),
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: hp(2),
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    backgroundColor: "white",
    borderRadius: 50,
    elevation: 7,
  },
  userName: {
    fontWeight: "bold",
    fontSize: hp(3),
    fontFamily: "Arial",
  },
  userAddress: {
    fontSize: hp(2),
    fontFamily: "Arial",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    marginBottom:5
  },
  noPosts: {
    textAlign: "center",
    fontSize: hp(2),
    fontWeight: "bold",
    color: "gray",
    marginVertical: 10,
  },
  loader: {
    width: 50,
    height: 50,
  },
});

export default Profile;
