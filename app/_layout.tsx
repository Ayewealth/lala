import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

import { AuthContext, AuthProvider, useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Creating a protected route
const InitialLayout = () => {
  const segments = useSegments();
  const router = useRouter();

  const [seenScreen, setSeenScreen] = useState<boolean | any>(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const { isAuthenticated } = useAuth();

  const getScreen = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("seenScreen");
      const auth = await AsyncStorage.getItem("isAuthenticated");
      setSeenScreen(jsonValue);
      setIsAuthenticated(auth);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const removeItem = async () => {
    await AsyncStorage.clear();
  };

  useEffect(() => {
    getScreen();
    // removeItem();
  }, []);

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    const inTabsGroup = segments[0] === "(app)";

    if (isAuthenticated && !inTabsGroup) {
      router.replace("/(app)/");
    } else if (!isAuthenticated && !seenScreen) {
      router.replace("/(onboarding)/welcome");
    } else if (!isAuthenticated && seenScreen) {
      router.replace("/(auth)/login");
    }
  }, [seenScreen, isAuthenticated]);

  return <Slot />;
};

// The File Root Layout
const RootLayout = () => {
  const [loaded] = useFonts({
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    PoppinsBlackItalic: require("../assets/fonts/Poppins-BlackItalic.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsBoldItalic: require("../assets/fonts/Poppins-BoldItalic.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsExtraBoldItalic: require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    PoppinsExtraLight: require("../assets/fonts/Poppins-ExtraLight.ttf"),
    PoppinsExtraLightItalic: require("../assets/fonts/Poppins-ExtraLightItalic.ttf"),
    PoppinsItalic: require("../assets/fonts/Poppins-Italic.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsLightItalic: require("../assets/fonts/Poppins-LightItalic.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsMediumItalic: require("../assets/fonts/Poppins-MediumItalic.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsSemiBoldItalic: require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
    PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
    PoppinsThinItalic: require("../assets/fonts/Poppins-ThinItalic.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      <StatusBar style="light" />;
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;
