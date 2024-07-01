import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    ></Tabs>
  );
}
