import React, { useState, useCallback } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { wp, hp } from "../helpers/common";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// Icons
import BackButton from "../assets/icons/BackButton";
import MailIcon from "../assets/icons/MailIcon";
import CustomIcon from "../assets/icons/CustomIcon";
import UserIcon from "../assets/icons/UserIcon";

const SignUp = ({ navigation }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = useCallback(async () => {
    const { name, email, password } = form;
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("SignUp", "Please fill all the fields!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: { data: { name: name.trim() } },
    });

    setLoading(false);

    if (error) {
      Alert.alert("SignUp Error", error.message);
    } else {
      setUser(data.user);
      navigation.navigate("Home");
    }
  }, [form, setUser, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <BackButton size={wp(6)} color="white" />
      </Pressable>

      <View style={styles.text}>
        <Text style={styles.welcomeText}>Let's</Text>
        <Text style={styles.welcomeText}>Get Started</Text>
      </View>

      <Text style={styles.formText}>
        Please fill the details to create an account
      </Text>

      <View style={styles.inputContainer}>
        <UserIcon />
        <TextInput
          value={form.name}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholder="Enter your name"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <MailIcon />
        <TextInput
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <CustomIcon />
        <TextInput
          value={form.password}
          onChangeText={(value) => handleInputChange("password", value)}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.center}>
        {!loading && (
          <TouchableOpacity style={styles.buttonContainer} onPress={onSubmit}>
            <LinearGradient
              colors={["#ff416c", "#ff4b2b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {loading && (
          <LottieView
            source={require("../assets/images/loading.json")}
            autoPlay
            loop
            style={styles.loader}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  backButton: {
    backgroundColor: "#ed0581",
    borderRadius: wp(3),
    padding: wp(2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    margin: hp(2),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#f7023b",
  },
  text: { margin: wp(4), margin: wp(5) },
  formText: { marginLeft: wp(5), marginBottom: hp(2), fontSize: hp(1.7) },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: wp(5),
    margin: hp(1),
    padding: hp(1.5),
    gap: 10,
  },
  input: { flex: 1 },
  center: { alignItems: "center", marginTop: hp(4) },
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 7,
    width: wp(90),
    justifyContent: "center",
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
  loginText: { color: "red", fontWeight: "bold" },
});

export default SignUp;
