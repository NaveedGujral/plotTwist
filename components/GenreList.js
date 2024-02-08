import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";

import GenreListCard from "./GenreListCard";

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, page } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;

export default function GenreList({ route }) {
  const { genre } = route.params;
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    async function getBooksByGenre(genre) {
      const { data, error } = await supabase
        .from("Listings")
        .select()
        .eq("Category", genre);

        const uniqueData = Array.from(
            new Set(data.map((item) => item.book_title))
          ).map((title) => data.find((item) => item.book_title === title));

      setGenreList(uniqueData);
    }

    getBooksByGenre(genre);
  }, []);

  return (
    <View style={page}>
      <View style={{ flex: 1, shadowOpacity: 1, shadowColor: PTRed, shadowRadius: 8, shadowOffset: 8 }}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            {genre}
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ height: "11%", width: "100%", backgroundColor: PTG3 }}></View>
        </View>
      </View>

      <View
        style={{
          flex: 8,
          backgroundColor: PTG4
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal={false}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "flex-start",
            flexWrap: "wrap",
          }}
          style={{ height: "100%" }}
        >
          {genreList.map((listing) => {
            return (
              <View style={styles.bookContainer}>
              <GenreListCard listing={listing} />
              </View>
            );
          })}

          {/* Dummy book containers */}
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          <View style={styles.bookContainer}></View>
          {/* Dummy book containers */}
          
        </ScrollView>
      </View>
    </View>
  );
}

{
  /* <View style={styles.bookList}>
    {genreList.map(listing => {
        return (
            <View
                style={styles.bookContainer}
                key={listing.book_id}
            >
                <View style={styles.book}>
                    <BookListCard listing={listing} />
                </View>
            </View>
        );
    })}
</View>  */
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 28,
    fontWeight: "bold",
    margin: 16,
    color: "white",
  },

  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  bookList: {
    // backgroundColor: PTGreen,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    flex: 1,
    alignContent: "flex-start",
  },
  bookContainer: {
    height: (2 * pageHeight) / 9,
    width: width / 3,
  },
  book: {
    flex: 1,
    height: 50,
    width: 50,
    // backgroundColor: PTBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});
