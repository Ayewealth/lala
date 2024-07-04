import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "@/context/AuthContext";
import isEqual from "lodash.isequal";

const Favorite = () => {
  const [savedPhrases, setSavedPhrases] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const { authToken } = useContext(AuthContext);

  const getSavedPhrases = async () => {
    setLoading(true);

    try {
      let response = await fetch(
        "https://lala-voice.onrender.com/api/saved-pharse/",
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
        if (!isEqual(savedPhrases, data)) {
          setSavedPhrases(data);
          console.log("Saved Phrase updated");
        } else {
          console.log("Saved Phrase are the same, no update needed");
        }
      } else console.log(data);
    } catch (error) {
      console.log("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedPhrases();
  }, [savedPhrases]);

  const removePhrase = async (id: number) => {
    setLoading2(true);

    try {
      let response = await fetch(
        `https://lala-voice.onrender.com/api/saved-pharse/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken?.access}`,
          },
        }
      );

      if (response.ok) {
        console.log("Deleted Saved Phrase");
        getSavedPhrases();
      }
    } catch (error) {
      console.log("Error: " + error);
    } finally {
      setLoading2(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator color={"white"} />
      </View>
    );
  }

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
                  <View style={{ flexDirection: "column", gap: 5 }}>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: 16,
                        color: "#fff",
                      }}
                    >
                      {item.phrase}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsMedium",
                        fontSize: 14,
                        color: "#656161",
                      }}
                    >
                      {item.language}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removePhrase(item.id)}>
                    {loading2 ? (
                      <ActivityIndicator color={"white"} />
                    ) : (
                      <AntDesign name="star" size={20} color="#fff" />
                    )}
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
