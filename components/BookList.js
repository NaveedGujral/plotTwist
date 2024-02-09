import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Animated
} from "react-native";
import supabase from "../config/supabaseClient";
import BookListCard from "./BookListCard";
import { useFonts } from "expo-font";
import {
  Bellefair_400Regular,
  JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
import { Ionicons, Entypo } from "@expo/vector-icons";

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, pillButton } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;

const { height, width } = Dimensions.get("window");

export default function BookList({ categoryName, id }) {
  const [bookList, setBookList] = useState([]);
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  
  function handleOnScroll(event) {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  }
  useEffect(() => {
    async function getBooks(categoryName) {
      let { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("Category", categoryName)
        .order("date_posted", { ascending: false })
        .range(0, 10);

      const uniqueData = Array.from(
        new Set(data.map((item) => item.book_title))
      ).map((title) => data.find((item) => item.book_title === title));

      setBookList(uniqueData);
    }

    getBooks(categoryName);
  }, []);

  const [fontsLoaded] = useFonts({
    Bellefair_400Regular,
    JosefinSans_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.categoryContainer}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          width: "93.34%",
        }}
      >
        <View style={{ flex: 1, height: "100%" }}></View>
        <View style={{ flex: 1, height: "100%", justifyContent: "center" }}>
          <Text
            style={{
              ...subHeading,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            {categoryName}
          </Text>
        </View>
        <View style={{ flex: 1, height: "100%", justifyContent: "center" }}>
          <Pressable
            style={styles.seeAllButton}
            onPress={() =>
              navigation.navigate("GenreList", { genre: categoryName })
            }
          >
            <Entypo
              name="dots-three-horizontal"
              size={height * 0.0223}
              color={PTG1}
              style={{ textAlignVertical: "center", textAlign: "center" }}
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          flex: 7,
          width: width,
          backgroundColor: PTBlue,
          flexDirection: "row",
        }}
        >

        <FlatList
          data={bookList}
          renderItem={({ item }) => <BookListCard listing={item}
          key={item.book_id}
          id={id} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          contentContainerStyle={{ 
            height: "100%", 
            // alignSelf: "center", 
            // backgroundColor: PTRed
            gap: width/24, 
            position: "absolute", 
          }}
          style={{ 
            flex: 1,
            backgroundColor: PTGreen }}
        />

        {/* <View
          style={{
            height: "100%",
            width: width / 4,
            backgroundColor: PTRed,
          }}
        ></View>
        <View
          style={{
            height: "100%",
            width: width / 4,
            backgroundColor: PTRed,
          }}
        ></View>
        <View
          style={{
            height: "100%",
            width: width / 4,
            backgroundColor: PTRed,
          }}
        ></View> */}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  categoryList: {},
  cardContainer: {
    flex: 1,
    width: width / 3,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  seeAllButton: {
    ...pillButton,
    // height: "66.67%",
    // width: "33.34%",
    // borderRadius: (height/27)*0.6667,
    backgroundColor: PTG3,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
