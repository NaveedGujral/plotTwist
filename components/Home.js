import {
  View,
  Text,
  Pressable,
  Dimensions,
  Platform,
  Image,
  Animated,
} from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";

import BookList from "./BookList";
import TopTenCarousel from "./TopTenCarousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { heading, subHeading, body, page, roundButton } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");

const pageHeight = height - (height / 27) * 4;
const catViewHeight = pageHeight / 3;

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currSession, setCurrSession] = useState();
  const [topTen, setTopTen] = useState([]);
  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollOffsetLimit = 200;
  const [trigger, setTrigger] = useState(false);

  const channel = supabase
    .channel("Listings")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
      },
      (payload) => {
        console.log(payload);
        setTrigger(!trigger);
      }
    )
    .subscribe();

  useEffect(() => {
    async function compareId(id) {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .match({ user_id: id });
      return data;
    }
    async function getData() {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;
      setCurrSession(session.user.id);
      return session.user.id;
    }
    getData()
      .then((id) => {
        return compareId(id);
      })
      .then((data) => {
        if (data.length === 0) {
          navigation.navigate("UserProfile");
        }
      });
  }, []);

  importFonts();

  useEffect(() => {
    async function getCategories() {
      const { data, error } = await supabase
        .from("Listings")
        .select("category");
      const catArr = [];
      data.forEach((obj) => {
        if (!catArr.includes(obj.category)) catArr.push(obj.category);
      });
      setCategories(catArr);
    }

    async function getTopTen(table) {
      const { data, error } = await supabase
        .from(table)
        .select()
        .order("no_of_wishlists", { ascending: false })
        .range(0, 9);
      setTopTen(data);
    }

    getTopTen("Listings");
    getCategories();
  }, [trigger]);

  return (
    <SafeAreaView style={page}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          onScroll={(event) => {
            setScrollOffset(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          style={{ height: "100%" }}
        >
          <View style={{ flex: 2, backgroundColor: PTG4 }}>
            <TopTenCarousel listings={topTen} id={currSession} trigger={trigger}/>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: PTG4,
              }}
            >
              <Text
                style={{
                  ...heading,
                  textAlign: "center",
                  paddingTop: catViewHeight / 54,
                }}
              >
                Genre
              </Text>
            </View>
            <View style={{ flex: 5, backgroundColor: PTG4 }}>
              {categories.map((category) => {
                return (
                  <BookList
                    categoryName={category}
                    key={category}
                    id={currSession}
                    trigger={trigger}
                  />
                );
              })}
            </View>
            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </View>
      {scrollOffset > scrollOffsetLimit && (
        <Pressable
          style={{
            position: "absolute",
            right: width * 0.5 - width / 18,
            top: height / 54,
          }}
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <View
            style={{
              ...roundButton,
              shadowColor: PTG4,
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.45,
              shadowRadius: 8,
              elevation: 1,
              zIndex: 1,
            }}
          >
            <MaterialCommunityIcons
              name="chevron-double-up"
              size={30}
              color={PTG1}
              style={{ textAlign: "center", width: "100%" }}
            />
          </View>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
