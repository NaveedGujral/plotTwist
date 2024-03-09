import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
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

export default function LibraryBookItem(item, id, inSwapReq) {
  const {
    book_id,
    img_url,
    book_title,
    author,
    condition,
    description,
    category,
  } = item.item;

  async function removeFromLibrary(book_id) {
    const { data, error } = await supabase
      .from("Listings")
      .delete()
      .eq("book_id", book_id);

    if (error) {
      alert(error);
    } 
  }

  return (
    <View key={book_id} style={styles.listContainer}>
      <View style={{ height: width / 27, width: "100%" }}></View>
      <View
        style={{
          width: width - (2 * width) / 27,
          height: containerHeight - (2 * width) / 27,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 3, height: "100%" }}>
          {img_url && (
            <Image source={{ uri: img_url }} style={styles.bookImage} />
          )}
        </View>
        <View style={{ flex: 6, height: "100%", flexDirection: "row" }}>
          <View
            style={{
              flex: 8,
              height: "100%",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                height: "33%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  ...subHeading,
                  fontWeight: "600",
                }}
              >
                {book_title}
              </Text>
            </View>
            <View
              style={{
                height: "33%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  ...subHeading,
                }}
              >
                {author}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, top: 0, alignItems: "center" }}>
            <Feather
              name="x"
              size={24}
              color={PTG1}
              style={{
                alignSelf: "center",
              }}
              onPress={() => removeFromLibrary(book_id)}
            />
          </View>
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
