import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import AuthHeader from "@/components/AuthHeader";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const setNewPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const getEmail = async () => {
    try {
      const jsonValue: any = await AsyncStorage.getItem("forgetEmail");
      setEmail(jsonValue);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword1(!showPassword1);
  };
  const handleForgetPassword = async () => {
    router.replace("/(auth)/(forget)/forgetPasswordSuccessful");
  };

  return (
    <Animated.View
      entering={FadeInLeft.duration(200).delay(200)}
      exiting={FadeOutRight.duration(200).delay(200)}
      style={styles.container}
    >
      <StatusBar style="light" />
      <AuthHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, marginTop: 15 }}
      >
        <View style={{ flexDirection: "column", gap: 20, width: "100%" }}>
          <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
            <Text
              style={{ fontFamily: "PoppinsBold", fontSize: 25, color: "#fff" }}
            >
              Set a New Password
            </Text>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 16,
                color: "#fff",
                lineHeight: 30,
              }}
            >
              Please verify your email address by entering the code we've sent
              to your inbox. Enter a new password for your Welearn account.
            </Text>
          </View>

          <TextInput
            placeholder="Enter Otp"
            style={styles.inputStyles}
            value={resetCode}
            onChangeText={setResetCode}
            placeholderTextColor="#fff"
          />
          <View style={{ position: "relative", width: "100%" }}>
            <TextInput
              placeholder="New Password"
              style={styles.inputStyles}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword1}
              placeholderTextColor="#fff"
            />

            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconStyle}
            >
              {showPassword1 ? (
                <Ionicons name="eye-off-outline" size={22} color="#fff" />
              ) : (
                <Ionicons name="eye-outline" size={22} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleForgetPassword}
            style={{
              alignItems: "center",
              backgroundColor: "#3572EF",
              padding: 15,
              borderRadius: 50,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#fff",
                fontSize: 15,
              }}
            >
              Update Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default setNewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  inputStyles: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#fff",
    width: "100%",
  },
  iconStyle: {
    position: "absolute",
    top: 17,
    right: 30,
  },
});
