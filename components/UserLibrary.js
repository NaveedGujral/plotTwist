import {
  Bellefair_400Regular,
  CormorantGaramond_400Regular,
  JosefinSans_400Regular,
  VollkornSC_400Regular,
} from "@expo-google-fonts/dev";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { React, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import supabase from "../config/supabaseClient";

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  pillButton,
  roundButton,
  roundButtonPressed,
  bookImage1
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const viewHeight = (9 * pageHeight) / 10;
const containerHeight = viewHeight / 3.5;

const UserLibrary = ({ session }) => {
  const [userLibrary, setUserLibrary] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (session) 
    getListings(session?.user?.user_metadata?.username);
    setUsername(session?.user?.user_metadata?.username);
  }, [userLibrary]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("Listings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date_posted", { ascending: false });

    if (error) {
      alert(error);
    } else {
      setUserLibrary(data);
    }
    setRefreshing(false);
  }, []);

  async function getListings(username) {
    const { data, error } = await supabase
      .from("Listings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date_posted", { ascending: false });

    if (error) {
      alert(error);
    } else {
      setUserLibrary(data);
    }
  }

  async function removeFromLibrary(book_id) {
    const { data, error } = await supabase
      .from("Listings")
      .delete()
      .eq("book_id", book_id);

    if (error) {
      alert(error);
    } else {
      setUserLibrary(userLibrary.filter((item) => item.book_id !== book_id));
    }
  }

  const [fontsLoaded] = useFonts({
    VollkornSC_400Regular,
    Bellefair_400Regular,
    CormorantGaramond_400Regular,
    JosefinSans_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={page}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            User Library
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              height: height / 729,
              width: "100%",
              backgroundColor: PTG1,
            }}
          ></View>
        </View>
      </View>

      <View style={{ flex: 9, justifyContent: "center", alignItems: "center" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {userLibrary.map(
            ({
              book_id,
              img_url,
              book_title,
              author,
              description,
              category,
            }) => (
              <View key={book_id} style={styles.listContainer}>
                <View style={{ height: width / 27, width: "100%" }}></View>
                <View
                  style={{
                    width: width - (2 * width) / 27,
                    height: containerHeight - (2 * width) / 27,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 3, height: "100%" }}>
                    {img_url && (
                      <Image
                        source={{ uri: img_url }}
                        style={styles.bookImage}
                      />
                    )}
                  </View>
                  <View
                    style={{ flex: 6, height: "100%", flexDirection: "row" }}
                  >
                    <View
                      style={{
                        flex: 8,
                        height: "100%",
                        justifyContent: "space-around",
                      }}
                    >
                      <View
                        style={{
                          height: "33%",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            ...subHeading,
                            fontWeight: "600",
                          }}
                        >
                          {book_title}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: "33%",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            ...subHeading,
                          }}
                        >
                          {author}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, top: 0, alignItems: "center" }}>
                      <Feather
                        name="x"
                        size={24}
                        color={PTG1}
                        style={{
                          alignSelf: "center",
                        }}
                        onPress={() => removeFromLibrary(book_id)}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: width / 27,
                    justifyContent: "flex-end",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: height / 729,
                      width: "100%",
                      backgroundColor: PTG2,
                    }}
                  ></View>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookImage: {
    width: (2 * (containerHeight - (2 * width) / 27)) / 3,
    borderRadius: width / 27,
    height: "100%",
    resizeMode: "cover",
  },
  listContainer: {
    display: "flex",
    position: "relative",
    height: containerHeight,
    width: width - (2 * width) / 27,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserLibrary;