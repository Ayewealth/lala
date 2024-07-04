import { AuthContext } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, Tabs } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

export default function TabLayout() {
  const { userDetails, setUserDetails, authToken } = useContext(AuthContext);

  const getUserDetails = async () => {
    try {
      let response = await fetch(
        "https://lala-voice.onrender.com/api/users-profile/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.access}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userDetails", JSON.stringify(data));
        setUserDetails(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [userDetails]);

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
          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,

                  borderColor: "#fff",
                  borderRadius: 50,
                  borderWidth: 1,
                }}
              >
                {userDetails &&
                userDetails.length > 0 &&
                userDetails[0].profile_pic ? (
                  <Image
                    source={{ uri: userDetails && userDetails[0]?.profile_pic }}
                    style={{
                      width: 35,
                      height: 35,
                      objectFit: "cover",
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 50,
                      backgroundColor: "#ccc",
                    }}
                  />
                )}
              </View>
            );
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
      <Stack.Screen
        name="account"
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

      <Stack.Screen
        name="edit"
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
