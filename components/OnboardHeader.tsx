import { View, Text, Image } from "react-native";
import React from "react";

const OnboardHeader = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#fff",
        borderWidth: 3,
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 60, height: 60 }}
      />
    </View>
  );
};

export default OnboardHeader;
