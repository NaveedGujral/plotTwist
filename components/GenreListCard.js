import { StyleSheet, View, Image, Pressable, Dimensions } from "react-native";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import WishListButton from "./WishListButton";

const { PTStyles, PTSwatches } = require("../Styling");
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");

const pageHeight = height - (height / 27) * 4;
const viewHeight = 8 * (pageHeight / 9);
const containerHeight = viewHeight / 3.5;

export default function GenreListCard({ listing, id }) {
  const [wishListed, setWishListed] = useState();
  const navigation = useNavigation();

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={styles.bookCard}
        onPress={() =>
          navigation.navigate("AvailableListings", { listing: listing })
        }
      >
        <Image style={styles.bookImage} source={{ uri: listing.img_url }} />
      </Pressable>
      <WishListButton
          listing={listing}
          id={id}
          wishListed={wishListed}
          setWishListed={setWishListed}
          styles={{
            heartContainer: styles.heartContainer,
            heart: 
              styles.heart
            ,
          }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bookCard: {
    width: (7 * width) / 27,
    height: (7 * containerHeight) / 9,
  },
  bookImage: {
    width: "100%",
    height: "100%",
    borderRadius: (4 * width) / 81,
    resizeMode: "cover",
  },
  heartContainer: {
    position: "absolute",
    width: (2 * width) / 27,
    height: (2 * width) / 27,
    borderRadius: width / 27,
    backgroundColor: PTG1,
    right: width / 27 + width / 81,
    top: containerHeight / 9 + width / 81,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.85,
  },
  heart: {
    textAlign: "center",
    textAlignVertical: "center",
    position: "absolute",
  },
});
