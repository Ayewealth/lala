import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const welcome = () => {
  const router = useRouter();

  const hasSeenScreen = async () => {
    await AsyncStorage.setItem("seenScreen", JSON.stringify(true));
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 20,
        paddingBottom: 50,
      }}
    >
      <StatusBar style="light" />
      <Animated.View
        entering={FadeInLeft.duration(200).delay(100)}
        exiting={FadeOutRight.duration(200).delay(100)}
        style={{
          flex: 1,
          width: "100%",
          gap: 15,

          marginTop: 20,
        }}
      >
        <Image
          source={require("@/assets/images/welcome.jpg")}
          style={{
            width: "100%",
            objectFit: "cover",
            height: 310,
            borderRadius: 20,
          }}
        />

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "PoppinsBold",
              fontSize: 25,
              marginBottom: 0,
              color: "#fff",
            }}
          >
            Hey there!
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsMedium",
              fontSize: 16,
              lineHeight: 25,
              color: "#fff",
            }}
          >
            Welcome to Lala Voice App. Ready for exciting adventures?
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInLeft.duration(200).delay(100)}
        exiting={FadeOutRight.duration(200).delay(100)}
      >
        <TouchableOpacity
          onPress={hasSeenScreen}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#3572EF",
            padding: 13,
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              fontFamily: "PoppinsBold",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default welcome;
