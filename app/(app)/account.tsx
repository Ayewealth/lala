import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const account = () => {
  const { userDetails, logoutUser } = useContext(AuthContext);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 20,
        width: "100%",
        backgroundColor: "#000",
        paddingHorizontal: 25,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontFamily: "PoppinsMedium",
          fontSize: 22,
          marginTop: 20,
        }}
      >
        Account
      </Text>

      <View style={{ flexDirection: "column", gap: 15 }}>
        <View style={{ flexDirection: "column", gap: 15 }}>
          {userDetails &&
          userDetails.length > 0 &&
          userDetails[0].profile_pic ? (
            <Image
              source={{ uri: userDetails[0].profile_pic }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                marginRight: 20,
              }}
            />
          ) : (
            <View
              style={{
                width: 85,
                height: 85,
                borderRadius: 50,
                backgroundColor: "#ccc",
              }}
            />
          )}
          <Text
            style={{ fontFamily: "PoppinsBold", fontSize: 17, color: "#fff" }}
          >
            {userDetails && userDetails[0]?.user?.fullname}
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: 14,
              color: "#fff",
            }}
          >
            {userDetails && userDetails[0]?.user?.email}
          </Text>

          <Link href="/(app)/edit" asChild>
            <TouchableOpacity
              style={{
                alignItems: "center",
                backgroundColor: "#3572EF",
                padding: 13,
                borderRadius: 50,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            onPress={logoutUser}
            style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
          >
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={{ color: "#fff", fontFamily: "PoppinsMedium" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default account;
