import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import supabase from "../config/supabaseClient";

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  pillButton,
  roundButton,
  roundButtonPressed,
  bookImage1,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const viewHeight = (8 * pageHeight) / 9;
const containerHeight = viewHeight / 3.5;

export default function LibraryBookItem(item) {
  const {
    activeUserCheck,
    activeUserID,
    book,
    id,
    inSwapReq,
    currSwap,
    setCurrSwap,
    // setTestState, testState
  } = item;

  const {
    book_id,
    img_url,
    book_title,
    author,
    condition,
    description,
    category,
  } = book;

  async function removeFromLibrary(book_id) {
    const { data, error } = await supabase
      .from("Listings")
      .delete()
      .eq("book_id", book_id);

    if (error) {
      alert(error);
    }
  }

  function updateCurrSwap() {    
    if (
      book_id !== currSwap.user1_listing_id &&
      book_id !== currSwap.user2_listing_id
    ) {
      if (activeUserCheck) {
        if (currSwap.user1_id === activeUserID) {
          setCurrSwap((prevState) => ({
            ...prevState,
            user1_listing_id: book_id,
            user1_author: author,
            user1_book_imgurl: img_url,
            user1_book_title: book_title,
            user1_category: category,
            user1_condition: condition,
            user1_desc: description,

          }));
        } else {
          setCurrSwap((prevState) => ({
            ...prevState,
            user2_listing_id: book_id,
            user2_author: author,
            user2_book_imgurl: img_url,
            user2_book_title: book_title,
            user2_category: category,
            user2_condition: condition,
            user2_desc: description,
          }));

        }
      } else {
        if (currSwap.user1_id === activeUserID) {
          setCurrSwap((prevState) => ({
            ...prevState,
            user2_listing_id: book_id,
            user2_author: author,
            user2_book_imgurl: img_url,
            user2_book_title: book_title,
            user2_category: category,
            user2_condition: condition,
            user2_desc: description,

          }));
        } else {
          setCurrSwap((prevState) => ({
            ...prevState,
            user1_listing_id: book_id,
            user1_author: author,
            user1_book_imgurl: img_url,
            user1_book_title: book_title,
            user1_category: category,
            user1_condition: condition,
            user1_desc: description,
          }));

        }
      }
    }
  }

  return (
    <View key={book_id} style={styles.listContainer}>
      <View style={{ height: width / 27, width: "100%" }}></View>
      <View
        style={{
          width: width - (2 * width) / 27,
          height: containerHeight - (2 * width) / 27,
          justifyContent: "space-between",
          gap: width / 27,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Pressable
          style={{ flex: 2, height: "100%" }}
          onPress={() => {
            updateCurrSwap();
          }}
        >
          {img_url && (
            <Image
              source={{ uri: img_url }}
              style={
                inSwapReq
                  ? currSwap.user1_listing_id === book_id ||
                    currSwap.user2_listing_id === book_id
                    ? { ...styles.bookImage, borderWidth: 5, borderColor: PTG1 }
                    : styles.bookImage
                  : styles.bookImage
              }
            />
          )}
        </Pressable>
        <View
          style={{
            flex: 4,
            height: "100%",
            flexDirection: "row",
            gap: width / 27,
          }}
        >
          <View
            style={{
              flex: 8,
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  ...body,
                }}
              >
                {" "}
              </Text>
              <Text
                style={{
                  ...subHeading,
                  fontWeight: "600",
                }}
              >
                {book_title}
              </Text>
              <Text
                style={{
                  ...body,
                }}
              >
                {" "}
              </Text>
              <Text
                style={{
                  ...subHeading,
                }}
              >
                {author}
              </Text>
              <Text
                style={{
                  ...body,
                }}
              >
                {" "}
              </Text>
              <Text
                style={{
                  ...subHeading,
                }}
              >
                Condition: {condition}
              </Text>
              <Text
                style={{
                  ...body,
                }}
              >
                {" "}
              </Text>
              <Text
                style={{
                  ...subHeading,
                }}
              >
                {category}
              </Text>
            </View>
          </View>

          {(activeUserCheck || inSwapReq) && (
            <View
              style={{
                flex: 1,
                top: 0,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {/* {inSwapReq && (
                <View>
                  <Ionicons
                    name="checkmark"
                    size={30}
                    color={
                      currSwap.user1_listing_id === book_id ||
                      currSwap.user2_listing_id === book_id
                        ? PTGreen
                        : PTG2
                    }
                    style={{
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      updateCurrSwap()
                    }}
                  />
                </View>
              )} */}

              {activeUserCheck && (
                <View >
                  <Feather
                    name="x"
                    size={30}
                    color={PTG2}
                    onPress={() => {
                      removeFromLibrary(book_id);
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          height: width / 27,
          justifyContent: "flex-end",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: PTG2,
          }}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookImage: {
    width: (2 * (containerHeight - (2 * width) / 27)) / 3,
    borderRadius: width / 27,
    height: "100%",
    resizeMode: "cover",
  },
  listContainer: {
    display: "flex",
    position: "relative",
    height: containerHeight,
    width: width - (2 * width) / 27,
    justifyContent: "center",
    alignItems: "center",
  },
});
