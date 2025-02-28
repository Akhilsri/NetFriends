import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  Image,
  Alert,
  Share,
} from "react-native";
import React, { useState, useEffect } from "react";
import { wp, hp, stripHtmlTag } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import ListIcon from "../assets/icons/ListIcon";
import RenderHTML from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "@/service/imageService";
import { Video } from "expo-av";
import HeartIcon from "../assets/icons/HeartIcon";
import ShareButton from "../assets/icons/ShareButton";
import ChatIcon from "../assets/icons/ChatIcon";
import { createPostLike, removePostLike } from "@/service/postService";
import * as Sharing from "expo-sharing";
import LottieView from "lottie-react-native";
import PostDetails from "@/screens/PostDetails";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import NewEditIcon from "../assets/icons/NewEditIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: TRenderEngineProvider",
  "Warning: MemoizedTNodeRenderer",
]);

const PostCard = ({
  item,
  currentUser,
  router,
  imageUrl,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {

  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const like = async () => {
    if (liked) {
      //remove like
      let updatedLikes = likes.filter((like) => like.userId != currentUser?.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log("removed like: ", res);

      setLiked(!liked);
    } else {
      //create like
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = createPostLike(data);
      console.log(res);

      setLiked(!liked);
    }
  };

  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const [likes, setLikes] = useState(item?.postLikes || []);

  useEffect(() => {
    // Set initial likes
    setLikes(item?.postLikes || []);
    // console.log(imageUrl);
    // console.log(item);
    
    

    // Check if the current user has already liked the post
    const hasLiked = item?.postLikes?.some(
      (like) => like.userId === currentUser?.id
    );
    setLiked(hasLiked);
  }, [item]); // Runs when `item` changes

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    navigation.navigate("PostDetails", { postid: item });
  };

  const createdAt = moment(item?.created_at).format("MMM D");

  const tagsStyles = {};

  //  console.log(getSupabaseFileUrl(item?.file))
  // console.log(item);

  const onShare = async () => {
    let content = { message: stripHtmlTag(item?.body) };

    if (item?.file) {
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      if (url) {
        try {
          await Sharing.shareAsync(url, { dialogTitle: "Share Image" });
          return;
        } catch (error) {
          console.error("Error sharing file:", error);
        }
      }
    }

    Share.share(content)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to do this ?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate("NewPost");
    // router.back()
    // router.push({pathname:'newPost',params:{...item}})
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* //user info and post time */}
        <View style={styles.userInfo}>
          <Avatar size={hp(6)} uri={item?.users?.image} />
          <View style={{ gap: 2, marginHorizontal: wp(2) }}>
            <Text style={styles.username}>{item?.users?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <ListIcon />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={handleEdit}
              style={{ paddingHorizontal: 10 }}
            >
              <NewEditIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <DeleteIcon />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <View>
          {item?.body && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {/* post image */}
        <View style={{ width: wp(100), alignItems: "center", padding: 5 }}>
          {item?.file && item?.file?.includes("postImages") && (
            <Image
              source={{ uri: getSupabaseFileUrl(item?.file).uri }}
              transition={100}
              style={styles.postMedia}
              contentFit="cover"
              resizeMode="cover"
            />
          )}
          {/* //post video */}
          {item?.file && item?.file?.includes("postVideos") && (
            <Video
              style={[styles.postMedia, { height: hp(30) }]}
              source={{ uri: getSupabaseFileUrl(item?.file).uri }}
              resizeMode="cover"
              isLooping
              useNativeControls
            />
          )}
        </View>
        {/* like,comment & share */}
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={like}  >
              <HeartIcon liked={liked}/>
            </TouchableOpacity>
            <View style={styles.count}>{<Text style={styles.countN} >{likes?.length}</Text>}</View>
            <TouchableOpacity onPress={openPostDetails}>
              {liked ? <ChatIcon /> : <ChatIcon />}
            </TouchableOpacity>
            <View style={styles.count}>
              {<Text style={styles.countN}>{item?.comments[0].count}</Text>}
            </View>
            {loading ? (
              <LottieView
                source={require("../assets/images/newLoading.json")}
                autoPlay
                loop
                style={styles.loader}
              />
            ) : (
              <TouchableOpacity onPress={onShare}>
                <ShareButton />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderColor: "gray",
    shadowColor: "gray",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    fontWeight: "bold",
  },
  postTime: {
    fontSize: wp(3.5),
  },
  userInfo: {
    flexDirection: "row",
  },
  postMedia: {
    height: hp(40),
    width: wp(90),
    marginRight: wp(14),
  },
  footerButton: {
    flexDirection: "row",
    
  },
  loader: {
    width: 100,
    height: 70,
    // backgroundColor:'red',
    padding: 0,
    position: "absolute",
    top: -18,
    left: wp(13),
  },
  count:{
    marginRight:wp(5),
  },
  countN:{
    fontSize:hp(2.5)
  }
  
});

export default PostCard;
