import { StyleSheet, View, Image, Pressable, Dimensions } from "react-native";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";

const { PTStyles, PTSwatches } = require("../Styling");
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");

const pageHeight = height - (height / 27) * 4;
const viewHeight = 5 * (pageHeight / 18);
const containerHeight = (8 * viewHeight) / 9;

export default function BookListCard({ listing, id }) {
  const [wishListed, setWishListed] = useState(false);
  const navigation = useNavigation();

  // console.log(listing)

  async function getUserWishList() {
    const { data, error } = await supabase
    .from("Users")
      .select("wishlist")
      .eq("user_id", id);
    return data[0].wishlist;
  }
  
  useEffect(() => {
    getUserWishList().then((res) => {
      const isWishListed = res.some(bookID => bookID === listing.book_id);
      setWishListed(isWishListed);
    });
  }, [listing.book_id]);

  async function handleWishListButton(listing) {
    const currentWishListed = wishListed;

    async function updateWishList(num) {
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("book_id", listing.book_id);
    }

    async function updateUserWishList(res) {
      if (res.includes(listing.book_id)) {
        return;
      }

      const updatedWishlist = [...res, listing.book_id];

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    async function removeItemFromWishList(res) {
      const updatedWishlist = res.filter((item) => item !== listing.book_id);

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    if (!currentWishListed) {
      setWishListed(true);
      await updateWishList(1);
      const res = await getUserWishList();
      await updateUserWishList(res);
    } else {
      setWishListed(false);
      await updateWishList(-1);
      const res = await getUserWishList();
      await removeItemFromWishList(res);
    }
  }

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
      <View style={{ flex: 1 }}>
        <Pressable
          style={styles.heartContainer}
          onPress={() => handleWishListButton(listing)}
        >
          {!wishListed ? (
            <AntDesign
              name="hearto"
              size={18}
              color="#C1514B"
              style={styles.heart}
            />
          ) : (
            <AntDesign
              name="heart"
              size={18}
              color="#C1514B"
              style={styles.heart}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    height: containerHeight,
    width: width / 4,
  },
  bookCard: {
    width: "100%",
    height: "77.78%",
    alignSelf: "center"
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
    right: width / 81,
    top: containerHeight/9 + width / 81,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.85,
  },
  heart: {
    position: "absolute",
  },
});
