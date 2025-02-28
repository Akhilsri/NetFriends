import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  LogBox,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { wp, hp } from "../helpers/common";
import BackButton from "../assets/icons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/Avatar";
import Camera from "@/assets/icons/Camera";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import LocationIcon from "@/assets/icons/LocationIcon";
import UserIcon from "@/assets/icons/UserIcon";
import {updateUserData} from '../service/userService'
import * as ImagePicker from 'expo-image-picker';

LogBox.ignoreAllLogs

const EditProfile = () => {
  const navigation = useNavigation();
  const { user: currentuser, setUserData } = useAuth();  
  const [display, setDisplay] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currentuser) {
      setUser({
        name: currentuser.user_metadata?.name || "",
        phoneNumber: currentuser.user_metadata?.phoneNumber || "",
        image: currentuser.user_metadata?.image || null, 
        address: currentuser.user_metadata?.address || "",
        bio: currentuser.user_metadata?.bio || "",
      });
    }
  }, [currentuser]);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [4, 3], 

    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setUser(prevUser => ({ ...prevUser, image: selectedImage }));
    } else {
      console.log("No image selected.");
    }
  };

  const onSubmit = async () => {
    let { phoneNumber, address, bio, image } = user;

    if (!phoneNumber || !address || !bio) {
      Alert.alert('Profile', 'Please fill all the fields');
      return;
    }

    setDisplay(false);
    setLoading(true);

    const res = await updateUserData(currentuser?.id, { phoneNumber, address, bio, image });

    setDisplay(true);
    setLoading(false);
    navigation.goBack();

    if (res.success) {
      
      setUserData({
        ...currentuser,
        user_metadata: { ...currentuser.user_metadata, ...res.data },
      });


    } else {
      Alert.alert('Error', res.msg || 'Failed to update profile');
    }
  };

  const [image, setImage] = useState(null); 

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container2}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
        
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <BackButton size={wp(6)} color="white" />
              </Pressable>
              <Text style={styles.title}>Edit Profile</Text>
            </View>

           
            <View style={styles.avatarContainer}>
              <Avatar uri={user?.image} size={hp(12)} style={{ borderRadius: 30 }} />
              <TouchableOpacity style={styles.cameraIcon} onPress={handleChoosePhoto}>
                <Camera />
              </TouchableOpacity>
            </View>

            
            <Text>Please fill your profile details</Text>

            <View style={styles.inputContainer}>
              <UserIcon />
              <TextInput
                value={user.name}
                onChangeText={(value) => setUser({ ...user, name: value })}
                placeholder="Enter your name"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <PhoneIcon />
              <TextInput
                value={user.phoneNumber}
                onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>...
            <View style={styles.inputContainer}>
              <LocationIcon />
              <TextInput
                value={user.address}
                onChangeText={(value) => setUser({ ...user, address: value })}
                placeholder="Enter your address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                value={user.bio}
                onChangeText={(value) => setUser({ ...user, bio: value })}
                placeholder="Enter your bio"
                multiline={true}
                style={[styles.input, styles.multilineInput]}
              />
            </View>
           
            <View style={{ alignItems: 'center', marginTop: hp(4) }}>
              {!display ? null : (
                <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
                  <LinearGradient
                    colors={['#ff416c', '#ff4b2b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ alignItems: 'center' }}>
              {loading ? (
                <LottieView
                  source={require('../assets/images/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
              ) : null}
            </View>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#ed0581",
    borderRadius: wp(3),
    padding: wp(2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: hp(2),
  },
  title: {
    marginTop: hp(2),
    fontSize: hp(2.5),
    fontWeight: "bold",
    marginHorizontal: wp(22),
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: hp(2),
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    backgroundColor: "white",
    borderRadius: 50,
    elevation: 7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: wp(5),
    margin: hp(2),
    padding: hp(1),
    gap: 5,
    width: wp(90),
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  multilineInput: {
    minHeight: hp(10),
    textAlignVertical: "top",
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 7,
    width: wp(90),
    justifyContent: 'center',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfile;
