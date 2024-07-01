import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, marginTop: 100, paddingHorizontal: 20 }}
      >
        <Animated.View
          entering={FadeInLeft.duration(200).delay(200)}
          exiting={FadeOutRight.duration(200).delay(200)}
          style={{ flexDirection: "column", gap: 70 }}
        >
          <View style={{ flexDirection: "column", gap: 20 }}>
            <View>
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 30,
                  lineHeight: 40,
                  color: "#fff",
                }}
              >
                Let's Get Started.
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsLight",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Welcome To Lala Voice.
              </Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "column",
                gap: 15,
              }}
            >
              <TextInput
                placeholder="Full Name"
                style={styles.inputStyles}
                value={fullname}
                onChangeText={setFullname}
                placeholderTextColor="#fff"
              />

              <TextInput
                placeholder="Email Address"
                style={styles.inputStyles}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#fff"
              />
              <View style={{ position: "relative", width: "100%" }}>
                <TextInput
                  placeholder="Enter Password"
                  style={styles.inputStyles}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#fff"
                />

                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.iconStyle}
                >
                  {showPassword ? (
                    <Ionicons name="eye-off-outline" size={22} color="#fff" />
                  ) : (
                    <Ionicons name="eye-outline" size={22} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={{
                alignItems: "center",
                padding: 13,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#656161",
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ alignItems: "center", flexDirection: "column", gap: 20 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 13,
                  borderRadius: 10,
                  backgroundColor: "#3572EF",
                  width: "100%",
                  gap: 5,
                }}
              >
                <Image
                  source={require("@/assets/images/google.png")}
                  style={{ width: 20, height: 20, objectFit: "contain" }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "PoppinsBold",
                    color: "#fff",
                  }}
                >
                  Google
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#ffff",
                fontSize: 14,
              }}
            >
              Already have an account?{" "}
              <Link
                href={"/(auth)/login"}
                style={{ color: "#3572EF", fontFamily: "PoppinsMedium" }}
              >
                Login
              </Link>
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
