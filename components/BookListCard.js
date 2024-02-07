import { StyleSheet, View, Image, Pressable, Dimensions } from "react-native";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");

export default function BookListCard({ listing, id }) {
  const [wishListed, setWishListed] = useState(false);
  const navigation = useNavigation();
  function handleWishListButton(listing) {
    async function updateWishList(num) {
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("book_id", listing.book_id);
    }
    async function getUserWishList() {
      const { data, error } = await supabase
        .from("Users")
        .select("wishlist")
        .eq("user_id", id);
      return data[0].wishlist;
    }

    async function updateUserWishList(res) {
      if (res.includes(listing.book_title)) {
        return;
      }

      const updatedWishlist = [...res, listing.book_title];

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    async function removeItemFromWishList(res) {
      const updatedWishlist = res.filter((item) => item !== listing.book_title);

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    if (!wishListed) {
      setWishListed(true);
      updateWishList(1);
      getUserWishList().then((res) => {
        updateUserWishList(res);
      });
    } else {
      setWishListed(false);
      updateWishList(0);
      getUserWishList().then((res) => {
        removeItemFromWishList(res);
      });
    }
  }

  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.bookCard}
        onPress={() =>
          navigation.navigate("AvailableListings", { listing: listing })
        }
      >
        <Image style={styles.bookImage} source={{ uri: listing.img_url }} />
      </Pressable>
      <Pressable
        style={styles.heartContainer}
        onPress={() => handleWishListButton(listing)}
      >
        <FontAwesome
          name="circle"
          size={32}
          color="white"
          style={{ opacity: 0.75 }}
        />
        {!wishListed ? (
          <AntDesign
            name="hearto"
            size={16}
            color="#C1514B"
            style={styles.heart}
          />
        ) : (
          <AntDesign
            name="heart"
            size={16}
            color="#C1514B"
            style={styles.heart}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    width: width / 3,
    height: "100%",
    // backgroundColor: PTRed,
    justifyContent: "center",
    alignItems: "center",
  },
  bookCard: {
    width: width / 3 - 2 * (width * 0.0334),
    height: "89.99%",
  },
  bookImage: {
    width: "100%",
    height: "100%",
    borderRadius: width/27,
    resizeMode: "cover"
  },
  heartContainer: {
    padding: 0,
    margin: 0,
    position: "absolute",
    top: "7.5%",
    right: "15%",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    textAlign: "center",
    textAlignVertical: "center",
    position: "absolute",
  },
});
