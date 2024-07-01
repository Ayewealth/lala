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
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "@/components/AuthHeader";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

const forgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleForgetPassword = async () => {
    router.replace("/(auth)/(forget)/setNewPassword");
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
        style={{ flex: 1, marginTop: 25 }}
      >
        <View style={{ flexDirection: "column", gap: 20, width: "100%" }}>
          <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
            <Text
              style={{ fontFamily: "PoppinsBold", fontSize: 25, color: "#fff" }}
            >
              Forgot Your Password?
            </Text>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 17,
                color: "#fff",
                lineHeight: 30,
              }}
            >
              Enter the email associated with your account and we'll send you a
              link to reset your password.
            </Text>
          </View>

          <TextInput
            placeholder="Email Address"
            style={styles.inputStyles}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#fff"
          />

          <View
            style={{ alignItems: "center", flexDirection: "column", gap: 30 }}
          >
            <TouchableOpacity
              onPress={handleForgetPassword}
              style={{
                alignItems: "center",
                backgroundColor: "#3572EF",
                padding: 13,
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
                Send Reset Mail
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#fff",
                fontSize: 14,
              }}
            >
              Remembered your password?{" "}
              <Link
                style={{ color: "#3572EF", fontFamily: "PoppinsMedium" }}
                href={"/(auth)/login"}
              >
                Login
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default forgetPassword;

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
