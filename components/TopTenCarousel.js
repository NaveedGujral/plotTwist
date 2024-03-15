import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  Animated,
  Text,
} from "react-native";
import CarouselItem from "./CarouselItem";
import Pagination from "./Pagination";
import { useRef, useState } from "react";

const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { heading, subHeading, body, page, webFix } = PTStyles;

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function TopTenCarousel({ listings, id }) {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  function handleOnScroll(event) {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  }

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View
        style={{
          flex: 3,
          justifyContent: "space-evenly",
          backgroundColor: PTG4
        }}
      >
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Top 10 Wishlisted
          </Text>
      </View>

      <View style={{ flex: 14 }}>
        <FlatList
          data={listings}
          renderItem={({ item }) => <CarouselItem item={item} id={id} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          contentContainerStyle={{ height: "100%", alignSelf: "center" }}
          style={{ flex: 1 }}
        />
      </View>

      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={{ height: "11%", width: "100%", backgroundColor: PTG4 }}></View>
        <Pagination listings={listings} scrollX={scrollX} />
        <View style={{ height: "11%", width: "100%", backgroundColor: PTG4 }}></View>
      </View>
    </View>
  );
}
