import { 
  Alert, View, Text, StyleSheet, Pressable, TouchableOpacity, TextInput, 
  LogBox
} from "react-native";
import React, { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from "../context/AuthContext";
import BackButton from "../assets/icons/BackButton";
import MailIcon from '../assets/icons/MailIcon';
import CustomIcon from '../assets/icons/CustomIcon';
import { wp, hp } from "../helpers/common";

LogBox.ignoreAllLogs

const Login = () => {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login", error.message);
    } else {
      setUser(data.user); 
      navigation.navigate("Home"); 
    }
  }, [email, password, navigation, setUser]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.navigate('Welcome')}>
        <BackButton size={wp(6)} color="white" />
      </Pressable>

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Hey,</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Please login to continue</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <MailIcon />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text.trim())}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.inputBox}>
          <CustomIcon />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text.trim())}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Text style={styles.forgetText}>Forgot Password?</Text>
      </View>

      <View style={styles.centered}>
        {!loading && (
          <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
            <LinearGradient
              colors={['#ff416c', '#ff4b2b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {loading && (
          <LottieView
            source={require('../assets/images/loading.json')}
            autoPlay
            loop
            style={styles.loader}
          />
        )}
      </View>

      <View style={styles.signUpContainer}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
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
  textContainer: {
    marginVertical: hp(3),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#f7023b',
  },
  subText: {
    fontSize: hp(2),
    color: 'gray',
    marginTop: hp(1),
  },
  inputContainer: {
    marginVertical: hp(2),
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp(5),
    padding: hp(1.5),
    marginVertical: hp(1),
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: hp(2),
  },
  forgetText: {
    textAlign: 'right',
    fontWeight: 'bold',
    color: 'gray',
    marginVertical: hp(1),
  },
  centered: {
    alignItems: 'center',
    marginTop: hp(4),
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
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    width: 150,
    height: 150,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
  },
  signUpText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Login;
