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
const { heading, subHeading, body } = PTStyles;
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

      setBookList(uniqueData.slice(0, 9));
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
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ ...subHeading }}>{categoryName}</Text>
      </View>
      <View style={{ flex: 8 }}>
        <View
          style={{
            width: width * 0.9,
            height: "100%",
            backgroundColor: PTBlue,
            // borderWidth: 3,
            // borderColor: PTBlue,
          }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: "row",
              justifyContent: "center",
            }}
            style={{ height: "100%" }}
          >

            <View
              style={{
                flex: 0.3,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  marginHorizontal: width*0.025,
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                  backgroundColor: PTRed,
                }}
              ></View>
            </View>

            {/* {bookList.map((listing) => {
              return (
                <BookListCard listing={listing} key={listing.book_id} id={id} />
              );
            })} */}

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
    // backgroundColor: PTG4,
    // backgroundColor: PTRed,
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
    height: 50,
    width: 50,
    borderRadius: 35,
    backgroundColor: PTGreen,
    justifyContent: "center",
    alignItems: "center",
  },
});
