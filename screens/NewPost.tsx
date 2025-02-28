import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import BackButton from "@/assets/icons/BackButton";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../helpers/common";
import { useNavigation } from "@react-navigation/native";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "../components/RichTextEditor";
import { RichEditor } from "react-native-pell-rich-editor";
import VideoIcon from "@/assets/icons/VideoIcon";
import ImageIcon from "@/assets/icons/ImageIcon";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { getSupabaseFileUrl } from "../service/imageService";
import TrashIcon from "../assets/icons/TrashIcon";
import { Video } from "expo-av";
import { createOrUpdatePost } from "../service/postService";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";

const windowHeight = Dimensions.get("window").height;

function NewPost({ navigation }) {
  const post = useLocalSearchParams()
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef<RichEditor | null>(null); // Ensure correct ref type
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(()=>{
    if(post && post.id){
      bodyRef.current = post.body;
      setFile(post.file || null)
    }
  },[])

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") return true;
    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }
    //check image or video for remote file
    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri; // Directly return file.uri for local files
    }
    return getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if (!bodyRef && !file) {
      Alert.alert("Post", "please choose an image or add post body");
    }
    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      navigation.navigate("Home");
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "white", marginHorizontal: wp(2) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackButton size={wp(6)} color="white" />
          </Pressable>
          <Text style={styles.title}>Create Post</Text>
        </View>
        <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: hp(2) }}>
          <View style={styles.infoBox}>
            <Avatar
              uri={user?.image}
              size={hp(6.2)}
              style={{ borderRadius: 10 }}
            />
            <View style={{ marginLeft: wp(2), }}>
              <Text style={{ fontWeight: "bold" }}>
                {user && user.user_metadata.name}
              </Text>
              <Text>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>
          <View style={{alignItems:'center',marginTop:hp(8)}} >
          {file && (
            <View style={styles.file}>
              {getFileType(file) == "video" ? (
                <>
                  <Video
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: getFileUri(file) }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                  />
                  <Pressable
                    style={{
                      position: "absolute",
                      right: wp(5),
                      top: hp(1),
                      backgroundColor: "red",
                      borderRadius: 50,
                      padding: 5,
                    }}
                    onPress={() => setFile(null)}
                  >
                    <TrashIcon />
                  </Pressable>
                </>
              ) : (
                <View>
                  <Image
                    source={{ uri: getFileUri(file) }}
                    resizeMode="contain"
                    style={{width:wp(99.9),height:hp(35.1)}}
                  />
                  <Pressable
                    style={{
                      position: "absolute",
                      right: wp(5),
                      top: hp(1),
                      backgroundColor: "red",
                      borderRadius: 50,
                      padding: 5,
                    }}
                    onPress={() => setFile(null)}
                  >
                    <TrashIcon />
                  </Pressable>
                </View>
              )}
            </View>
          )}
          </View>
        </ScrollView>
        <View style={styles.media}>
          <Text>Add text to your post</Text>
          <View style={styles.mediaIcons}>
            <TouchableOpacity
              onPress={() => onPick(true)}
              style={{ paddingHorizontal: wp(2) }}
            >
              <ImageIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPick(false)}>
              <VideoIcon />
            </TouchableOpacity>
          </View>
        </View>
        {loading ? (
          <View style={{alignItems:'center'}} >
            <LottieView
              source={require("../assets/images/loading.json")}
              autoPlay
              loop
              style={styles.loader}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
            <LinearGradient
              colors={["green", "red"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
    marginTop: hp(2),
    marginLeft: wp(2),
  },
  title: {
    marginTop: hp(2),
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginHorizontal: wp(22),
  },
  infoBox: {
    marginTop: wp(3),
    marginLeft: wp(3),
    flexDirection: "row",
  },
  textEditor: {
    minHeight: windowHeight * 0.3, // Set a dynamic height
    paddingTop:hp(1)
  },
  media: {
    marginTop: hp(0),
    borderWidth: 2,
    borderRadius: hp(1),
    padding: wp(2),
    marginHorizontal: wp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaIcons: {
    flexDirection: "row",
    marginHorizontal: wp(1),
  },
  file: {
    width: wp(94.5),
    borderWidth: 1,
    marginBottom: 5,
    overflow: "hidden",
    maxHeight: hp(50),
    
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 7,
    width: wp(96),
    justifyContent: "center",
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  loader: { width: 150, height: 150 },
  footer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(4),
  },
});

export default NewPost;
