import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const edit = () => {
  const { userDetails, authToken } = useContext(AuthContext);

  const [profilePic, setProfilePic] = useState(
    userDetails && userDetails ? userDetails[0]?.profile_pic : null
  );
  const [name, setName] = useState(
    userDetails && userDetails ? userDetails[0]?.user?.fullname : ""
  );
  const [email, setEmail] = useState(
    userDetails && userDetails ? userDetails[0]?.user?.email : ""
  );
  const [date, setDate] = useState(
    userDetails && userDetails ? userDetails[0]?.user?.date_joined : ""
  );
  const [hasP, setHasP] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const togglePasswordVisibility1 = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleRemovePic = () => {
    setProfilePic(
      userDetails && userDetails ? userDetails[0]?.profile_pic : null
    );
    setHasP(false);
  };

  const uploadProfile = async () => {
    setHasP(true);
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        saveProfile(result.assets[0]);
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const saveProfile = async (image: any) => {
    try {
      setProfilePic(image);
    } catch (error) {
      throw error;
    }
  };

  const updateProfilePic = async () => {
    setLoading1(true);

    const formData = new FormData();
    if (profilePic) {
      const profileFile: any = {
        name: profilePic.fileName,
        uri: profilePic.uri,
        type: profilePic.mimeType,
        size: profilePic.fileSize,
      };
      formData.append("profile_pic", profileFile);
    }

    try {
      let response = await fetch(
        `https://lala-voice.onrender.com/api/users-profile/${
          userDetails && userDetails[0]?.id
        }`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken.access}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile Picture was successfully updated.");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading1(false);
    }
  };

  const updateUserData = async () => {
    setLoading2(true);

    try {
      let response = await fetch(
        `https://lala-voice.onrender.com/api/users/${
          userDetails && userDetails[0]?.user?.id
        }/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify({
            fullname: name,
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("User Name Successfully Updated");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
    }
  };

  const updatePassword = async () => {
    setLoading3(true);

    try {
      let response = await fetch(
        "https://lala-voice.onrender.com/api/change-password/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.access}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.status);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading3(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 20,
        width: "100%",
        backgroundColor: "#000",
        paddingHorizontal: 25,
        paddingBottom: 30,
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
        Edit Account
      </Text>

      <ScrollView
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "column", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                position: "relative",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#3572EF",
                borderRadius: 100,
                width: 120,
                height: 120,
              }}
            >
              <Image
                source={{
                  uri:
                    typeof profilePic === "string"
                      ? profilePic
                      : profilePic?.uri,
                }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  marginRight: 20,
                }}
              />
              {hasP ? (
                <TouchableOpacity
                  onPress={handleRemovePic}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 8,
                    borderRadius: 50,
                    borderWidth: 0,
                    backgroundColor: "red",
                  }}
                >
                  <Feather name="trash-2" size={18} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={uploadProfile}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 8,
                    borderRadius: 50,
                    borderWidth: 0,
                    backgroundColor: "#3572EF",
                  }}
                >
                  <MaterialIcons name="camera-alt" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={updateProfilePic}
              style={{
                backgroundColor: "#3572EF",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 50,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsMedium",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                {loading1 ? <ActivityIndicator color={"white"} /> : "Upload"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{ fontFamily: "PoppinsBold", fontSize: 17, color: "#fff" }}
          >
            {userDetails[0]?.user?.fullname || "John Doe"}
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: 14,
              color: "#fff",
            }}
          >
            {userDetails[0]?.user?.email}
          </Text>
        </View>

        <View style={{ flexDirection: "column", gap: 15, marginTop: 30 }}>
          <Text
            style={{ fontFamily: "PoppinsBold", fontSize: 17, color: "#fff" }}
          >
            Personal Information
          </Text>

          <View style={{ flexDirection: "column", gap: 15 }}>
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Full Name"
                style={styles.inputStyles}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#fff"
              />
              <FontAwesome6
                name="edit"
                size={20}
                color="#555555"
                style={{ position: "absolute", right: 15, top: "32%" }}
              />
            </View>
            <TextInput
              placeholder="John Doe"
              value={email}
              onChangeText={setEmail}
              editable={false}
              placeholderTextColor={"#000"}
              style={{
                padding: 12,
                borderRadius: 10,
                fontFamily: "PoppinsRegular",
                fontSize: 15,
                borderColor: "rgba(85, 85, 85, 0.3)",
                borderWidth: 1,
                backgroundColor: "#ffff",
                color: "#000",
              }}
            />
            <TextInput
              placeholder="John Doe"
              value={date}
              onChangeText={setDate}
              editable={false}
              placeholderTextColor={"#000"}
              style={{
                padding: 12,
                borderRadius: 10,
                fontFamily: "PoppinsRegular",
                fontSize: 15,
                borderColor: "rgba(85, 85, 85, 0.3)",
                borderWidth: 1,
                backgroundColor: "#ffff",
                color: "#000",
              }}
            />
          </View>

          <TouchableOpacity
            onPress={updateUserData}
            style={{
              alignItems: "center",
              backgroundColor: "#3572EF",
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#fff",
                fontSize: 14,
              }}
            >
              {loading2 ? <ActivityIndicator color="#fff" /> : "Update Name"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "column", gap: 15, marginTop: 30 }}>
          <Text
            style={{ fontFamily: "PoppinsBold", fontSize: 17, color: "#fff" }}
          >
            Change Password
          </Text>

          <View style={{ flexDirection: "column", gap: 15 }}>
            <View style={{ position: "relative", width: "100%" }}>
              <TextInput
                placeholder="Old Password"
                style={styles.inputStyles}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#fff"
              />

              <TouchableOpacity
                onPress={togglePasswordVisibility1}
                style={styles.iconStyle}
              >
                {showPassword ? (
                  <Ionicons name="eye-off-outline" size={22} color="#fff" />
                ) : (
                  <Ionicons name="eye-outline" size={22} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ position: "relative", width: "100%" }}>
              <TextInput
                placeholder="New Password"
                style={styles.inputStyles}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword2}
                placeholderTextColor="#fff"
              />

              <TouchableOpacity
                onPress={togglePasswordVisibility2}
                style={styles.iconStyle}
              >
                {showPassword2 ? (
                  <Ionicons name="eye-off-outline" size={22} color="#fff" />
                ) : (
                  <Ionicons name="eye-outline" size={22} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={updatePassword}
            style={{
              alignItems: "center",
              backgroundColor: "#3572EF",
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#fff",
                fontSize: 14,
              }}
            >
              {loading3 ? (
                <ActivityIndicator color="#fff" />
              ) : (
                "Update Password"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default edit;

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
