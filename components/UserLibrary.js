import {
  Bellefair_400Regular,
  CormorantGaramond_400Regular,
  JosefinSans_400Regular,
  VollkornSC_400Regular,
} from "@expo-google-fonts/dev";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { React, useCallback, useEffect, useState } from "react";
import LibraryBookItem from "./LibraryBookItem";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  bookImage1,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const viewHeight = (8 * pageHeight) / 9;
const containerHeight = viewHeight / 3.5;

const UserLibrary = ({ session }) => {
  const [userLibrary, setUserLibrary] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [username, setUsername] = useState("");

  // experimental
  // const [testState, setTestState] = useState(false)

  useEffect(() => {
    if (session) getListings();
  }, [userLibrary]);

  // useEffect(() => {
  //   console.log("parent testState", testState)
  // }, [testState])

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

  async function getListings() {
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
            Your Library
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
           <LinearGradient
        colors={[PTGreen, PTBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 2,
          width: "100%",
        }}
      ></LinearGradient>
        </View>
      </View>

      <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={userLibrary}
          renderItem={({ item }) => (
            <LibraryBookItem 
            book={item} 
            id={item.book_id} 
            inSwapReq={false} 
            activeUserCheck={true} 
            // setTestState={setTestState} 
            // testState={testState}
            />
          )}
          keyExtractor={(item) => item.book_id.toString()}
          vertical={true}
          pagingEnabled
          snapToAlignment="center"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: "100%", alignSelf: "center" }}
          style={{ flex: 1 }}
        />
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
