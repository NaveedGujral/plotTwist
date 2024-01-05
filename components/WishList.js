import { React, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const WishList = ({ session }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (session) getWishList(session?.user?.user_metadata?.username);
  }, []);

  const getWishList = async (username) => {
    const { data, error } = await supabase
      .from("Users")
      .select("wishlist")
      .eq("username", username)
      .limit(1)
      .single();

    if (error) {
      alert(error);
    } else {
      const uniqueBooks = [...new Set(data.wishlist)];
      setBooks(uniqueBooks);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.header}>Wishlist</Text>
        {books.map((book) => (
          <View key={book} style={styles.listContainer}>
            <Text style={styles.titleText}>{book}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  listContainer: {
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#e3e3e3",
    padding: 16,
    borderRadius: 8,
    width: Dimensions.get("window").width - 32,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
export default WishList;
