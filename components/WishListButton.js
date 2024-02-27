import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import supabase from "../config/supabaseClient";

const { PTStyles, PTSwatches } = require("../Styling");
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");

const pageHeight = height - (height / 27) * 4;
const viewHeight = 5 * (pageHeight / 18);
const containerHeight = (8 * viewHeight) / 9;

export default function WishListButton({
  listing,
  id,
  wishListed,
  setWishListed,
  styles,
  iconSize,
}) {
  const [userWishlist, setUserWishlist] = useState([]);

  useEffect(() => {
    getUserWishList()
    .then((res) => {
      setUserWishlist(res);
      const isWishListed = res.some((bookID) => bookID === listing.book_id);
      setWishListed(isWishListed);
    });
  }, [userWishlist]);

  async function getUserWishList() {
    const { data, error } = await supabase
      .from("Users")
      .select("wishlist")
      .eq("user_id", id);
    return data[0].wishlist;
  }

  async function handleWishListButton() {
    const currentWishListed = wishListed;

    async function updateWishList(num) {  
      const { data, error } = await supabase
        .from("Listings")
        .update({ no_of_wishlists: listing.no_of_wishlists + num })
        .eq("book_id", listing.book_id);
    }

    async function updateUserWishList(userWishlist) {
      setWishListed(true);
      if (userWishlist.includes(listing.book_id)) {
        return;
      }

      const updatedWishlist = [...userWishlist, listing.book_id];

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    async function removeItemFromWishList(userWishlist) {
      setWishListed(false);
      const updatedWishlist = userWishlist.filter((item) => item !== listing.book_id);

      const { data, error } = await supabase
        .from("Users")
        .update({ wishlist: updatedWishlist })
        .eq("user_id", id);
    }

    if (!currentWishListed) {
      await updateUserWishList(userWishlist);
      await updateWishList(1);
    } else {
      await removeItemFromWishList(userWishlist);
      await updateWishList(-1);
    }
  }

  return (
    <Pressable style={styles.heartContainer} onPress={handleWishListButton}>
      {!wishListed ? (
        <AntDesign name="hearto" size={iconSize} style={styles.heart} />
      ) : (
        <AntDesign name="heart" size={iconSize} style={styles.heart} />
      )}
    </Pressable>
  );
}
