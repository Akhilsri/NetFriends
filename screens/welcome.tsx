import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { wp, hp } from '../helpers/common';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const navigation = useNavigation();
  const [showAnimation, setShowAnimation] = useState(false);

  const boom = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000); // Hide after 2 seconds
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      {/* Welcome image */}
      <Image style={styles.welcomeImage} source={require('../assets/images/welcome.png')} />
      
      {/* Title */}
      <View style={styles.between}>
        <Text style={styles.title}>NetFriends</Text>
        <Text style={styles.punchline}>Unite, Express, Thrive!</Text>
      </View>

      {/* Footer */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.buttonContainer} onLongPress={boom}>
        <LinearGradient
          colors={['#ff416c', '#ff4b2b']} // Gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Getting Started</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Show animation when long-pressed */}
     
        <LottieView
          source={require('../assets/images/welcome.json')} // Use your animation file
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      

      {/* Bottom Text */}
      <View style={styles.bottomtextcontainer}>
        <Text>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  between: {
    gap: 50,
  },
  welcomeImage: {
    width: wp(80),
    height: hp(50),
    resizeMode: "contain",
  },
  title: {
    fontWeight: "800",
    fontFamily: "monospace",
    fontSize: hp(4),
  },
  punchline: {
    fontWeight: "600",
    fontFamily: "serif",
    fontSize: hp(2),
    position: "relative",
    bottom: 50,
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 7,
    width: wp(80),
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomtextcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  loginText: {
    color: "red",
    fontWeight: "bold",
  },
  lottie: {
    position: "absolute",
    width: wp(150),
    height: hp(50),
    top: "25%",
  },
});

export default Welcome;
