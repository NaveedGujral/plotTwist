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
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const { PTStyles, PTSwatches } = require('../Styling')
const { heading, subHeading, body } = PTStyles
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

const screenWidth = Dimensions.get("window").width;

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
      <Text style={{...subHeading, marginTop: 20}}>{categoryName}</Text>
      <View style={styles.categoryList}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {bookList.map((listing) => {
            return (
              <BookListCard listing={listing} key={listing.book_id} id={id} />
            );
          })}
          <View style={styles.cardContainer}>
            <Pressable
              style={styles.linkCard}
              onPress={() =>
                navigation.navigate("GenreList", { genre: categoryName })
              }
            >
              <Ionicons name="arrow-forward" size={30} color={PTG1} style={{ textAlignVertical: "center" ,textAlign: "center"}} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
	categoryContainer: {
		alignItems: "center",
		flex: 1,
	},
	categoryList: {
		width: screenWidth,
		marginTop: 10,
		marginTop: 7,
		marginBottom: 10,
	},
	cardContainer: {
		flex: 1,
		width: screenWidth / 3,
		padding: 5,
		justifyContent: "center",
		alignItems: 'center',
	},
	linkCard: {
		height: 50,
		width: 50,
		borderRadius: 35,
		backgroundColor: PTBlue,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
