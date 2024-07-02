import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const Favorite = () => {
  const [savedPhrases, setSavedPhrases] = useState([
    { id: 1, value: "Hello" },
    { id: 2, value: "Phrase" },
    { id: 3, value: "Saved" },
    { id: 4, value: "Hey" },
  ]);

  const removePhrase = (id: number) => {
    setSavedPhrases(savedPhrases.filter((phrase) => phrase.id !== id));
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
        Saved
      </Text>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {savedPhrases.length > 0 ? (
          <View style={{ flexDirection: "column", gap: 20 }}>
            {savedPhrases.map((item) => {
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    {item.value}
                  </Text>
                  <TouchableOpacity onPress={() => removePhrase(item.id)}>
                    <AntDesign name="star" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 100,
            }}
          >
            <AntDesign name="star" size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontFamily: "PoppinsMedium",
                fontSize: 20,
              }}
            >
              Save Key phrases
            </Text>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 15,
                color: "#fff",
                textAlign: "center",
              }}
            >
              Tap the star icon to save translations you use most
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Favorite;
