import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import supabase from "../config/supabaseClient";
import ListedBook from "./ListedBook";
import WishListButton from "./WishListButton";

const screenHeight = Dimensions.get("window").height;
const api = process.env.GOOGLE_BOOKS_API_KEY;

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, page, gradTile, tileHeaderBox, tileImage } =
  PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");

const pageHeight = height - (height / 27) * 4;
const bookImageWidth = width * 0.4445 * 0.9334;
const viewHeight = 2 * (pageHeight / 3);
const containerHeight = viewHeight - viewHeight / 4;

export default function AvailableListings({ route }) {
  const navigation = useNavigation();
  const { session, listing } = route.params;
  const id = session.user.id;
  const [listings, setListings] = useState([]);
  const [userName, setUserName] = useState("");
  const [bookInfo, setBookInfo] = useState({});
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swapRequestMade, setSwapRequestMade] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [wishListed, setWishListed] = useState(false);

  useEffect(() => {
    async function getAllListings() {
      const { data, error } = await supabase
        .from("Listings")
        .select("*")
        .eq("book_title", listing.book_title);
      setListings(data);
    }
    async function getBookOwner() {
      const { data, error } = await supabase
        .from("Users")
        .select("username")
        .eq("user_id", listing.user_id);
      setUserName(data[0].username);
    }
    getAllListings();
    getBookOwner();
  }, []);
  
  const blurb = listing.description;
  let newBlurb;
  if (blurb) {
    const regex = /<\/?[^>]+>/g;
    newBlurb = blurb.replace(regex, "");
  }

  return (
    <View style={page}>
      <View
        style={{
          flex: 2,
          shadowOpacity: 1,
          shadowRadius: 8,
          shadowOffset: 8,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Listings & Wishlists
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 9,
          justifyContent: "center",
          alignItems: "center",
          height: containerHeight,
          width: width,
        }}
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
            <Text numberOfLines={2} style={tileHeaderBox}>
              {listing.book_title}
            </Text>
          </View>
          <Image style={tileImage} source={{ uri: listing.img_url }} />
          <View style={{ justifyContent: "center", flex: 1 }}>
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
                <View style={{justifyContent:"flex-start"}}>
                  <Ionicons
                    name="add-outline"
                    size={36}
                    style={{ color: PTG1, alignSelf: "stretch",width:"100%", height:"100%" }}
                    onPress={() =>
                      navigation.navigate("CreateListing", {
                        currTitle: listing.book_title,
                        authors: listing.author,
                        currDescription: listing.description,
                        imgUrl: listing.img_url,
                        navigation: navigation,
                        book_id: listing.google_book_id,
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
                  listing={listing}
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
                          {listing.book_title}
                        </Text>
                        <Text style={subHeading}> </Text>
                        <Text style={subHeading}>{listing.author}</Text>
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
      </View>
      <View
        style={{
          flex: 7,
        }}
      ></View>
    </View>
  );

  return (
    <View
      style={
        Platform.OS === "web"
          ? { ...styles.container, ...styles.webFix }
          : styles.container
      }
    >
      <View style={{ flex: 1 }}>
        <Pressable
          // onPress={() => setIsModalVisible(true)}
          style={styles.descriptionButton}
        >
          <Text style={{ ...subHeading, textAlign: "center" }}>About</Text>
        </Pressable>
      </View>

      <View style={styles.halfPage}>
        <View style={styles.bookInfoBox}>
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              height: "100%",
              marginBottom: 25,
            }}
          >
            <Text style={styles.title}> {bookInfo.title}</Text>
            <View style={styles.bookCardContainer}>
              <Image
                style={styles.bookCard}
                source={{ uri: listing.img_url }}
              />
            </View>
            {Object.keys(bookInfo).length > 0 ? (
              <View>
                <Text style={styles.author}> {bookInfo.authors}</Text>
                <Text style={styles.text}>
                  Released on {bookInfo.publishedDate}
                </Text>
                <Pressable
                  onPress={() => setIsModalVisible(true)}
                  style={styles.descriptionButton}
                >
                  <Text style={styles.text}>About</Text>
                </Pressable>

                <Modal isVisible={isModalVisible} backdropOpacity={2}>
                  <View style={styles.modal}>
                    <View
                      style={{ flexDirection: "column", alignItems: "left" }}
                    >
                      <Text style={styles.text}>{newBlurb}</Text>
                      <View>
                        <Pressable
                          onPress={() => setIsModalVisible(false)}
                          style={styles.closeButton}
                        >
                          <Text style={styles.text}>Close</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            ) : (
              <Text style={styles.text}> No information available </Text>
            )}
          </LinearGradient>
        </View>
      </View>

      <View style={[styles.halfPage, { marginTop: 30 }]}>
        <Text style={styles.title}>Books listed by users:</Text>
        <FlatList
          data={listings}
          keyExtractor={(item) => item.book_id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.text}>
                {" "}
                Posted by {userName} on{" "}
                {new Date(item.date_posted).toLocaleDateString()}{" "}
              </Text>
              <Text style={styles.text}> Condition is {item.condition} </Text>
              <Pressable style={styles.descriptionButton}>
                <ListedBook
                  username={userName}
                  route={{ session: session, listing: item }}
                />
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
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
  container: {
    backgroundColor: "#272727",
    flex: 1,
  },
  webFix: {
    marginBottom: screenHeight * 0.09,
  },
  halfPage: {
    flex: 1,
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
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    padding: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  author: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    padding: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    // position: "absolute",
    top: 60,
    right: 10,
    borderRadius: 50,
    padding: 10,
  },
  descriptionButton: {
    backgroundColor: "#3B8D77",
    fontSize: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.33,
    borderRadius: 15,
    marginTop: 10,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  bookInfoBox: {
    borderColor: "white",
    borderRadius: 30,
    borderWidth: 3,
    margin: 15,
  },
  button: {
    borderWidth: 2,
    borderColor: "blue",
  },
  bookCardContainer: {
    borderRadius: 50,
    overflow: "hidden",
  },
  bookCard: {
    height: 150,
    resizeMode: "contain",
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
  item: {
    borderColor: "black",
    borderWidth: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  listItem: {
    borderTopWidth: 1,
    borderBlockColor: "white",
    paddingTop: 10,
  },
  seeAllButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
