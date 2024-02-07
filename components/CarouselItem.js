import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, gradTile, bookCoverImage } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const pageHeight = height - (height / 27) * 4;
const viewHeight = 2*(pageHeight/3)
const containerHeight = viewHeight - viewHeight/4

export default function CarouselItem({ item }) {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("AvailableListings", { listing: item })
      }
      style={styles.container}
    >
      <LinearGradient
        colors={[PTGreen, PTBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={gradTile}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: "89.78%",
          }}
        >
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.headerBox}>
            {item.book_title}
          </Text>
        </View>
        <Image style={styles.image} source={{ uri: item.img_url }} />
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={{ ...subHeading, textAlign: "center" }}>
            {item.no_of_wishlists} people want this book
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: containerHeight,
    width: width,
    padding: 0,
    margin: 0,
  },
  headerBox: {
    ...subHeading,
    textAlign: "center",
    fontWeight: "600",
  },
  image: {
    borderRadius: 20,
    flex: 4,
    width: "44%",
    resizeMode: "cover",
  },
});
