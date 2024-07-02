// CustomTabBar.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".caf",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const handleMicPress = async () => {
    try {
      const result = await Audio.requestPermissionsAsync();
      if (result.status === "granted") {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(recordingOptions);
        recording.setOnRecordingStatusUpdate((status) => {
          if (status.isDoneRecording) {
            Speech.speak("Recording finished!");
          }
        });
        await recording.startAsync();
        setTimeout(() => recording.stopAndUnloadAsync(), 5000);
      }
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  return (
    <View style={{ flexDirection: "row", height: 60, backgroundColor: "#000" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        if (route.name === "Mic") {
          return (
            <TouchableOpacity
              key={index}
              onPress={handleMicPress}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: 150,
                top: -20,
                backgroundColor: "#3572EF",
                borderRadius: 50,
                padding: 20,
                zIndex: 1000,
                elevation: 100,
                shadowColor: "#000",
              }}
            >
              <Ionicons
                name="mic"
                size={24}
                color={isFocused ? "#673ab7" : "#fff"}
              />
            </TouchableOpacity>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: isFocused ? "#3572EF" : "#fff" }}>
              {options.tabBarLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
