import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import ListedBook from "./ListedBook";
import Collapsible from "react-native-collapsible";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import Modal from "react-native-modal";
import { Dimensions } from "react-native";
import {
  VollkornSC_400Regular,
  Bellefair_400Regular,
  CormorantGaramond_400Regular,
  Lora_400Regular,
  JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
const screenHeight = Dimensions.get("window").height;
const api = process.env.GOOGLE_BOOKS_API_KEY;

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, page, gradTile, tileHeaderBox, tileImage } =
  PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");

const pageHeight = height - (height / 27) * 4;
const bookImageWidth = width * 0.4445 * 0.9334;

export default function AvailableListings({ route }) {
  const navigation = useNavigation();
  const { session, listing } = route.params;
  const [listings, setListings] = useState([]);
  const [userName, setUserName] = useState("");
  const [bookInfo, setBookInfo] = useState({});
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swapRequestMade, setSwapRequestMade] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const googleID = route.params.listing.google_book_id;

  // Heading block is 1/6 of 2/3 = 2/18 = 1/9
  // Linear Square is 9/12 of 2/3 = 18/36 = 1/2

  useEffect(() => {
    // async function getBookInfo() {
    //   if (googleID) {
    //     try {
    //       const response = await fetch(
    //         `https://www.googleapis.com/books/v1/volumes/${googleID}?key=${api}`
    //       );
    //       const data = await response.json();
    //       setBookInfo(data.volumeInfo);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    // }
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
    // getBookInfo();
    getAllListings();
    getBookOwner();
  }, []);
  const blurb = listing.description;
  let newBlurb;
  if (blurb) {
    const regex = /<\/?[^>]+>/g;
    newBlurb = blurb.replace(regex, "");
  }

  console.log(listing);

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
          height: "100%",
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
            <Text adjustsFontSizeToFit numberOfLines={2} style={tileHeaderBox}>
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
                  backgroundColor: PTG1,
                }}
              ></View>
              <View
                style={{
                  height: bookImageWidth / 5,
                  width: bookImageWidth / 5,
                  borderRadius: bookImageWidth / 10,
                  backgroundColor: PTG1,
                }}
              ></View>
              <View
                style={{
                  height: bookImageWidth / 5,
                  width: bookImageWidth / 5,
                  justifyContent: "center"
                }}
              >
                <Pressable
                  style={styles.seeAllButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Entypo
                    name="dots-three-horizontal"
                    size={height * 0.0223}
                    color={PTG1}
                    style={{ textAlignVertical: "center", textAlign: "center" }}
                  />
                </Pressable>

                <Modal transparent={true} isVisible={isModalVisible}>
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
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
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
