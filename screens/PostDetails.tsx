import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { createComment, fetchPostDetails, removeComment, removePost } from "@/service/postService";
import { ScrollView } from "react-native-gesture-handler";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { wp, hp, stripHtmlTag } from "../helpers/common";
import LottieView from "lottie-react-native";
import CommentItem from "../components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/service/userService";
import { createNotification } from "@/service/notificationService";

const PostDetails = () => {
  const route = useRoute(); // Get route object
  const { user } = useAuth();
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const router = useRouter();
  const { postid,commentId } = route.params || {}; // Retrieve post data
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState(null);

  // useEffect(() => {
  //   getPostDetails();
  // }, []);

  const handleNewComment = async (payload) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
  
      setPost(prevPost => ({
        ...prevPost,
        comments: [newComment, ...(prevPost?.comments || [])]
      }));
    }
  };
  

  useEffect(() => {
    const commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filters: [`postId=eq.${postid}`]
        },
        handleNewComment
      )
      .subscribe();
  
    getPostDetails();
  
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);


  const onNewComment = async () => {
    if (!commentRef.current) return null;

    const data = {
      userId: user?.id,
      postId: postid?.id,
      text: commentRef?.current,
    };
    //create comment
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      if(user.id!=postid.userId){
        //send the notification
        let notify = {
          senderId : user.id,
          receiverId : postid.userId,
          title:'commented on your post',
          data : JSON.stringify({postId : postid,commentId:res?.data?.id})
        }
        createNotification(notify)
      }
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postid?.id);
    if (res.success) setPost(res.data);
    // console.log(res);
  };

  const onDeleteComment = async(comment) =>{
    console.log('deleting',comment);
    let res = await removeComment(comment?.id)
    if(res.success){
        setPost(prevPost=>{
            let updatedPost = {...prevPost}
            updatedPost.comments = updatedPost.comments.filter(c=>c.id != comment.id)
            return updatedPost
        })
    }else{
        Alert.alert('Comment',res.msg)
    }
    
  }

  if (!post) {
    setInterval(() => {
      return (
        <View style={{ margin: 10, padding: 10, justifyContent: "center" }}>
          <Text
            style={{ fontSize: 30, fontWeight: "bold", fontFamily: "serif" }}
          >
            Post not found!
          </Text>
        </View>
      );
    }, 2000);
  }

  const onDeletePost = async(item)=>{
    let res = await removePost(postid?.id);
    if(res.success){
      router.back()
    }
    else{
      Alert.alert('Post',res.msg)
    }
  }
  const onEditPost = async(item)=>{
    console.log('hii');
    
      route.back()

  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length || 0 }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />
        {/* //input container */}
        <View style={styles.inputContainer}>
          <ScrollView>
            <TextInput
              style={{
                fontSize: 15,
                padding: 10,
                maxWidth: wp(78),
                borderWidth: 1,
                borderRadius: 20,
                maxHeight: hp(10),
              }}
              multiline
              ref={inputRef}
              placeholder="Type comment..."
              onChangeText={(value) => (commentRef.current = value)}
            />
          </ScrollView>
          {loading ? (
            <LottieView
              source={require("../assets/images/newLoading.json")}
              autoPlay
              loop
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity onPress={onNewComment}>
              <Image
                source={require("@/assets/images/send-message.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* comment list */}
        <View style={{}} >
          
          {post?.comments?.map((comment) => (
            <View style={styles.comment} >
            <CommentItem key={comment?.id?.toString()} item={comment} onDelete={onDeleteComment} canDelete ={user?.id == comment.userId || user.id == post.userId}  />
            </View>
          ))
          }
          
          {
            post?.comments?.length==0 && (
                <Text>Be first to comment</Text>
            )
          }
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loader: {
    width: wp(15),
    height: wp(15),
  },
  comment:{
   marginTop:hp(3),
  
   
  }
});

export default PostDetails;
