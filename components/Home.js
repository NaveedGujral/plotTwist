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

const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { heading, subHeading, body, page, webFix } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;

const { height, width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currSession, setCurrSession] = useState();
  const [topTen, setTopTen] = useState([]);
  const scrollRef = useRef();
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollOffsetLimit = 200;

  importFonts();

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

  useEffect(() => {
    async function getCategories() {
      const { data, error } = await supabase
        .from("Listings")
        .select("Category");
      const catArr = [];
      data.forEach((obj) => {
        if (!catArr.includes(obj.Category)) catArr.push(obj.Category);
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
  }, []);

  return (
    <View style={page}>
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
            <TopTenCarousel listings={topTen} />
          </View>
          <View style={{ flex: 1, }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  ...heading,
                  textAlign: "center",
                  paddingVertical: "1.12%",
                }}
              >
                Categories
              </Text>
            </View>
            <View style={{ flex: 5 }}>
              {categories.map((category) => {
                return (
                  <BookList
                  categoryName={category}
                  key={category}
                  id={currSession}
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
        style={
            styles.BTTContainer
          }
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}
        >
          <View style={styles.BTTCircle}>
            <MaterialCommunityIcons name="chevron-double-up" size={30} color={PTG1} style={styles.BTTArrow}/>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  BTTContainer: {
    position: "absolute",
    right: (width * 0.5) - (width/18),
    top: height/54,
  },
  BTTHeight: {
  },
  BTTCircle: {
    width: width/9,
    height: width/9,
    borderRadius: width/18,
    backgroundColor: PTGreen,
    shadowColor: PTG4,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 1,
    zIndex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  BTTArrow: {
    textAlign: "center",
    width: "100%",
  },
});

export default HomeScreen;
