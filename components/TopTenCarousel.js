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
const { heading, subHeading, body, page, webFix } = PTStyles;

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function TopTenCarousel({ listings }) {
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
    <View style={{ width: "100%", height: "100%" }}>
      <View style={{ flex: 2,justifyContent: "space-around" }}>
        <Text style={{ ...heading, textAlign: "center" }}>
          Spotlight
        </Text>
        <Text
          style={{
            ...subHeading,
            textAlign: "center",
          }}
        >
          Top 10 Most Wishlisted
        </Text>
      </View>

      <View style={{ flex: 9}}>
        <FlatList
          data={listings}
          renderItem={({ item }) => <CarouselItem item={item} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
        />
      </View>

      <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex:1
          }}
        >
          <Pagination listings={listings} scrollX={scrollX} />
        </View>
    </View>
  );
}
