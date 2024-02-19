import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import WishListButton from "./WishListButton";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, gradTile, tileHeaderBox, tileImage } =
  PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;

const pageHeight = height - (height / 27) * 4;
const bookImageWidth = width * 0.4445 * 0.9334;
const viewHeight = 2 * (pageHeight / 3);
const containerHeight = viewHeight - viewHeight / 4;

export default function CarouselItem({ item, id }) {
  const navigation = useNavigation();
  const [wishListed, setWishListed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const blurb = item.description;
  let newBlurb;
  if (blurb) {
    const regex = /<\/?[^>]+>/g;
    newBlurb = blurb.replace(regex, "");
  }

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
          <Text adjustsFontSizeToFit numberOfLines={2} style={tileHeaderBox}>
            {item.book_title}
          </Text>
        </View>
        <Image style={tileImage} source={{ uri: item.img_url }} />

        <View style={{ justifyContent: "center", flex: 1 }}>
          {/* <Text style={{ ...subHeading, textAlign: "center" }}>
            {item.no_of_wishlists} people want this book
          </Text> */}

          <View
            style={{
              flexDirection: "row",
              width: bookImageWidth,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                height: bookImageWidth / 5,
                width: bookImageWidth / 5,
                borderRadius: bookImageWidth / 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ justifyContent: "flex-start" }}>
                <Ionicons
                  name="add-outline"
                  size={36}
                  style={{
                    color: PTG1,
                    alignSelf: "stretch",
                    width: "100%",
                    height: "100%",
                  }}
                  onPress={() =>
                    navigation.navigate("CreateListing", {
                      currTitle: item.book_title,
                      authors: item.author,
                      currDescription: item.description,
                      imgUrl: item.img_url,
                      navigation: navigation,
                      book_id: item.google_book_id,
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                height: bookImageWidth / 5,
                width: bookImageWidth / 5,
                justifyContent: "center",
              }}
            >
              <WishListButton
                listing={item}
                id={id}
                wishListed={wishListed}
                setWishListed={setWishListed}
                iconSize={24}
                styles={{
                  heartContainer: styles.heartContainer,
                  heart: styles.heart,
                }}
              />
            </View>
            <View
                style={{
                  height: bookImageWidth / 5,
                  width: bookImageWidth / 5,
                  justifyContent: "center",
                }}
              >
                <Pressable onPress={() => setIsModalVisible(true)}>
                  <Entypo
                    name="dots-three-horizontal"
                    size={height * 0.0223}
                    color={PTG1}
                    style={{ textAlignVertical: "center", textAlign: "center" }}
                  />
                </Pressable>

                <Modal isVisible={isModalVisible}>
                  <View style={styles.modal}>
                    <LinearGradient
                      colors={[PTGreen, PTBlue]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          width: width * 0.9334,
                          height: (height / 27) * 2,
                        }}
                      >
                        <Entypo
                          name="cross"
                          size={30}
                          color={PTG1}
                          style={{ alignSelf: "center" }}
                          onPress={() => setIsModalVisible(false)}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "left",
                          width: width * 0.9334,
                          height: height - (height / 27) * 2,
                        }}
                      >
                        <Text style={subHeading}> </Text>
                        <Text style={{ ...tileHeaderBox, textAlign: "left" }}>
                          {item.book_title}
                        </Text>
                        <Text style={subHeading}> </Text>
                        <Text style={subHeading}>{item.author}</Text>
                        <Text style={subHeading}> </Text>
                        <Text style={subHeading}>{newBlurb}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </Modal>
              </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heartContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    textAlign: "center",
    textAlignVertical: "center",
    position: "absolute",
    color: PTG1,
  },
  modal: {
    width: width,
    height: height,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    backgroundColor: PTG4,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: containerHeight,
    width: width,
  },
});
