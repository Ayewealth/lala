import { Stack, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#000",
          },
          headerShadowVisible: false,
          headerTitle: "Lala Voice",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "PoppinsBold",
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="favorite"
        options={{
          headerStyle: {
            backgroundColor: "#000",
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "PoppinsMedium",
            fontSize: 18,
          },
        }}
      />
    </Stack>
  );
}
