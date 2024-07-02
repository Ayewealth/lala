import React, { useCallback, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Audio } from "expo-av";

export default function HomeScreen() {
  const [fromLanguage, setFromLanguage] = useState("English");
  const [toLanguage, setToLanguage] = useState("Afrikaans");
  const [word, setWord] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguageType, setCurrentLanguageType] = useState<"from" | "to">(
    "from"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const Language = [
    { key: "1", value: "Afrikaans" },
    { key: "2", value: "Albanian" },
    { key: "3", value: "Amharic" },
    { key: "4", value: "Arabic" },
    { key: "5", value: "Armenian" },
    { key: "6", value: "Assamese" },
    { key: "7", value: "English" },
    { key: "8", value: "French" },
    { key: "9", value: "Frisian" },
    { key: "10", value: "Galician" },
    { key: "11", value: "German" },
  ];

  const openModal = (type: "from" | "to") => {
    setCurrentLanguageType(type);
    setModalVisible(true);
  };

  const selectLanguage = (value: string) => {
    if (currentLanguageType === "from") {
      setFromLanguage(value);
    } else {
      setToLanguage(value);
    }
    setModalVisible(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#202020", paddingBottom: 30 }}>
      <StatusBar style="light" />

      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "#000",
          paddingHorizontal: 25,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <TextInput
          placeholder="Enter Text"
          style={{
            fontFamily: "PoppinsRegular",
            color: "#fff",
            fontSize: 20,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
          value={word}
          onChangeText={setWord}
          placeholderTextColor="#fff"
        />
      </View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "column",
          gap: 30,
          paddingHorizontal: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={styles.languageBox}
            onPress={() => openModal("from")}
          >
            <Text style={styles.languageText}>{fromLanguage}</Text>
          </TouchableOpacity>

          <MaterialIcons name="translate" size={22} color="#fff" />

          <TouchableOpacity
            style={styles.languageBox}
            onPress={() => openModal("to")}
          >
            <Text style={styles.languageText}>{toLanguage}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Link href="/(app)/favorite" asChild>
            <TouchableOpacity
              style={{ backgroundColor: "#000", padding: 13, borderRadius: 50 }}
            >
              <AntDesign name="star" size={22} color="#fff" />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={{ backgroundColor: "#000", padding: 45, borderRadius: 100 }}
          >
            {recording ? (
              <Entypo name="controller-stop" size={24} color="#fff" />
            ) : (
              <Feather name="mic" size={22} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRefresh}
            style={{ backgroundColor: "#000", padding: 13, borderRadius: 50 }}
          >
            <Ionicons name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text
            style={{
              color: "#fff",
              paddingHorizontal: 15,
              fontFamily: "PoppinsMedium",
              fontSize: 20,
            }}
          >
            Translate {currentLanguageType}
          </Text>
          <FlatList
            data={Language}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageItem}
                onPress={() => selectLanguage(item.value)}
              >
                <Text style={styles.modalText}>{item.value}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  languageBox: {
    borderRadius: 15,
    backgroundColor: "#fff",
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  languageText: {
    color: "#000",
    fontFamily: "PoppinsMedium",
    fontSize: 15,
  },
  modalText: {
    color: "#fff",
    fontFamily: "PoppinsRegular",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  languageItem: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  closeButton: {
    padding: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#000",
    fontFamily: "PoppinsMedium",
    fontSize: 15,
  },
});
