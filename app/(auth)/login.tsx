import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setAuthToken, setIsAuthenticated } = useContext(AuthContext);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      let response = await fetch(
        "https://lala-voice.onrender.com/api/signin/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const decode = jwtDecode(data.access);
        setAuthToken(data);
        setUser(decode);
        setIsAuthenticated(true);
        await AsyncStorage.setItem("authToken", JSON.stringify(data));
        await AsyncStorage.setItem("decodedAccess", JSON.stringify(decode));
        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
        router.replace("/(app)/");
      } else {
        alert(data.detail);
        console.log(data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

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
                Hey Welcome Back.
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsLight",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Lala Voice is your go-to platform.
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
              <Link href={"/(auth)/(forget)/forgetPassword"} asChild>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    Forgotten Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
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
                {loading ? <ActivityIndicator color={"white"} /> : "Login"}
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
              Don’t have an account?{" "}
              <Link
                href={"/(auth)/register"}
                style={{ color: "#3572EF", fontFamily: "PoppinsMedium" }}
              >
                Sign up
              </Link>
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

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
