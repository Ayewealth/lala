import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableWithoutFeedbackComponent,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
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
import { translate } from "google-translate-api-x";
import * as Clipboard from "expo-clipboard";
import Languages from "@/utils/language";
import * as Speech from "expo-speech";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const [fromLanguage, setFromLanguage] = useState("English");
  const [fromLanguageKey, setFromLanguageKey] = useState("en");
  const [toLanguage, setToLanguage] = useState("Afrikaans");
  const [toLanguageKey, setToLanguageKey] = useState("af");
  const [word, setWord] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLanguageType, setCurrentLanguageType] = useState<"from" | "to">(
    "from"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { authToken, userDetails } = useContext(AuthContext);

  const openModal = (type: "from" | "to") => {
    setCurrentLanguageType(type);
    setModalVisible(true);
  };

  const selectLanguage = (selectedLanguage: { key: string; value: string }) => {
    if (currentLanguageType === "from") {
      setFromLanguage(selectedLanguage.value);
      setFromLanguageKey(selectedLanguage.key);
    } else {
      setToLanguage(selectedLanguage.value);
      setToLanguageKey(selectedLanguage.key);
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

  const handleTranslate = async () => {
    try {
      const fromLangCode = fromLanguageKey.toLowerCase();
      const toLangCode = toLanguageKey.toLowerCase();

      const res = await translate(word, {
        from: fromLangCode,
        to: toLangCode,
        forceTo: true,
        autoCorrect: true,
      });
      setTranslatedText(res.text);
    } catch (err) {
      console.error("Translation error", err);
      setTranslatedText("Error translating text");
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(translatedText);
  };

  const speak = async () => {
    setIsSpeaking(true);
    try {
      const speechOptions = {
        language: toLanguageKey.toLowerCase(),
      };
      Speech.speak(translatedText, speechOptions);
    } catch (error) {
      console.error("Speech error", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const savePhrase = async () => {
    let response = await fetch(
      "https://lala-voice.onrender.com/api/saved-pharse/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken?.access}`,
        },
        body: JSON.stringify({
          user: userDetails && userDetails[0]?.user?.id,
          phrase: word,
          language: translatedText,
        }),
      }
    );

    const data = await response.json();
    if (response.status === 201) {
      alert("Phrase Saved Successfully");
    } else {
      console.log(data);
    }
  };

  useEffect(() => {
    if (word === "") {
      setTranslatedText("");
    }
    handleTranslate();
  }, [fromLanguage, toLanguage, word]);

  return (
    <View style={{ flex: 1, backgroundColor: "#202020", paddingBottom: 30 }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            gap: 20,
            width: "100%",
            backgroundColor: "#000",
            paddingHorizontal: 25,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              placeholder="Enter Text"
              style={{
                fontFamily: "PoppinsMedium",
                color: "#fff",
                fontSize: 22,
              }}
              value={word}
              onChangeText={(text) => {
                setWord(text);
                handleTranslate();
              }}
              placeholderTextColor="#fff"
              multiline
              numberOfLines={2}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{ height: 2, width: 200, backgroundColor: "#656161" }}
            ></View>
          </View>
          {translatedText && (
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 10,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  fontSize: 13,
                  color: "#3572EF",
                }}
              >
                {toLanguage}
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsMedium",
                  color: "#3572EF",
                  fontSize: 22,
                }}
              >
                {translatedText}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={speak}>
                  {isSpeaking ? (
                    <Entypo name="controller-stop" size={22} color="#3572EF" />
                  ) : (
                    <AntDesign name="sound" size={22} color="#3572EF" />
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <TouchableWithoutFeedback onPress={copyToClipboard}>
                    <Ionicons name="copy-outline" size={22} color="#3572EF" />
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={savePhrase}>
                    <AntDesign name="staro" size={22} color="#3572EF" />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          )}
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
                style={{
                  backgroundColor: "#000",
                  padding: 13,
                  borderRadius: 50,
                }}
              >
                <AntDesign name="star" size={22} color="#fff" />
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={{
                backgroundColor: "#000",
                padding: 45,
                borderRadius: 100,
              }}
            >
              {recording ? (
                <Entypo name="controller-stop" size={24} color="#fff" />
              ) : (
                <Feather name="mic" size={22} color="#fff" />
              )}
            </TouchableOpacity>

            <Link href="/(app)/account" asChild>
              <TouchableOpacity
                onPress={onRefresh}
                style={{
                  backgroundColor: "#000",
                  padding: 13,
                  borderRadius: 50,
                }}
              >
                <AntDesign name="setting" size={22} color="#fff" />
              </TouchableOpacity>
            </Link>
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
              data={Languages}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => selectLanguage(item)}
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
      </KeyboardAvoidingView>
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
