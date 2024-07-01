import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const AuthHeader = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthHeader;
