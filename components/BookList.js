import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  Image,
  ScrollView,
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
        <View style={{ flex: 1, height: "100%", justifyContent: "center"}}>
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
      <View style={{ flex: 7 }}>
        <View
          style={{
            
            width: width,
            height: "100%", 
          }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignContent: "flex-end"
            }}
            style={{ height: "100%" }}
          >
            {/* Splits the view into 3 equal sections*/}
            <View
              style={{
                flex: 1 / 4,
                flexDirection: "row",
                gap: width/24
              }}
            >
              {/* booklist card Start*/}
              {/* Category section*/}
              {/* <View
                style={{
                  flexDirection: "row",
                  width: width/3,
                  height: "100%",
                  backgroundColor: PTRed,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > */}
              {/* Category Book link needs to have these*/}
              {/* <View
                  style={{
                    width: width / 3 - 2 * (width * 0.0334),
                    height: "89.99%",
                    backgroundColor: PTBlue,
                  }}
                ></View>
              </View> */}
              {/* booklist card END*/}

              {bookList.map((listing) => {
                return (
                  <BookListCard
                    listing={listing}
                    key={listing.book_id}
                    id={id}
                  />
                );
              })}
            </View>

            {/* <View style={styles.cardContainer}>
            <Pressable
              style={styles.seeAllButton}
              onPress={() =>
                navigation.navigate("GenreList", { genre: categoryName })
              }
            >
              <Entypo name="dots-three-horizontal" size={24} color={PTG1} style={{ textAlignVertical: "center" ,textAlign: "center"}} />
            </Pressable>
          </View> */}
          </ScrollView>
        </View>
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
