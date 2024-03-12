import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import {
  ScreenWidth,
  ScreenHeight,
  color,
} from "react-native-elements/dist/helpers";
import { useNavigation } from "@react-navigation/native";
import supabase from "../config/supabaseClient";
import { useEffect, useState, useRef } from "react";
import {
  Entypo,
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  Feather
} from "@expo/vector-icons";
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";
import LibraryBookItem from "./LibraryBookItem";
import { LinearGradient } from "expo-linear-gradient";

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  pillButton,
  roundButton,
  roundButtonPressed,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { width, height } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const containerWidth = width - (2 * width) / 27;

const headerFlex = 3;
const userInfoFlex = 7;
const booksFlex = 14;
const buttonsFlex = 3;

export default function SwapNegotiationPage({ route }) {
  const navigation = useNavigation();
  const [user1ProfilePic, setUser1ProfilePic] = useState();
  const [user2ProfilePic, setUser2ProfilePic] = useState();
  const [user2BookUrl, setUser2BookUrl] = useState("");
  const [reconsidered, setReconsidered] = useState(false);
  const [timeKey, setTimeKey] = useState(Date.now());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeUserLibrary, setActiveUserLibrary] = useState([]);
  const [nonActiveUserLibrary, setNonActiveUserLibrary] = useState([]);
  const activeUserLibraryRef = useRef(activeUserLibrary);
  const nonActiveUserLibraryRef = useRef(nonActiveUserLibrary);

  // Passed down props from swap card or notifications
  const { info, session, type } = route.params;

  const [currType, setCurrType] = useState(type);

  if (currType === "activeReceived") {
    setCurrType("received");
  }
  if (currType === "activeSent") {
    setCurrType("sent");
  }

  const [currSwap, setCurrSwap] = useState(info);
  const {
    pending_swap_id,
    user1_author,
    user1_book_imgurl,
    user1_book_title,
    user1_id,
    user1_listing_id,
    user1_username,
    user1_category,
    user1_condition,
    user1_desc,
    user2_author,
    user2_book_imgurl,
    user2_book_title,
    user2_id,
    user2_listing_id,
    user2_username,
    user2_category,
    user2_condition,
    user2_desc,
  } = currSwap;

  const activeUserID =
    session.user.id === info.user1_id ? info.user1_id : info.user2_id;
  const nonActiveUserID =
    session.user.id === info.user1_id ? info.user2_id : info.user1_id;
  const [activeUserCheck, setActiveUserCheck] = useState();
  const [modalUserID, setModalUserID] = useState();
  const [modalLibrary, setModalLibrary] = useState();

  // State to trigger fetchAllListings
  const [triggerFetch, setTriggerFetch] = useState(false);

  // MVP ONLY - NEEDS REFACTORING TO BE SCALABLE!
  useEffect(() => {
    switch (info.user1_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Nav.jpg")
        );
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Jake.jpg")
        );
        break;
      case "c563d513-b021-42f2-a3b3-77067b8547af":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Jay.jpg")
        );
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Ana.jpg")
        );
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Alicia.jpg")
        );
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b":
        setUser1ProfilePic(
          require("../assets/ExampleUserProfilePictures/Faith.jpg")
        );
        break;
    }
  }, []);
  useEffect(() => {
    switch (info.user2_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Nav.jpg")
        );
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Jake.jpg")
        );
        break;
      case "c563d513-b021-42f2-a3b3-77067b8547af":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Jay.jpg")
        );
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Ana.jpg")
        );
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Alicia.jpg")
        );
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b":
        setUser2ProfilePic(
          require("../assets/ExampleUserProfilePictures/Faith.jpg")
        );
        break;
    }
  }, []);

  useEffect(() => {
    fetchAllListings();
  }, [triggerFetch]);

  useEffect(() => {
    fetchAllListings();
    handleUserIDChange();
  }, [activeUserID, nonActiveUserID]);

  useEffect(() => {
    updateSwapInfo(currSwap);
  }, [currSwap]);

  function handleUserIDChange() {
    setTriggerFetch((prev) => !prev);
  }

  async function getListings(user_id) {
    const { data, error } = await supabase
      .from("Listings")
      .select("*")
      .eq("user_id", user_id)
      .order("date_posted", { ascending: false });

    if (error) {
      // alert(error);
    } else {
      return data;
    }
  }

  async function fetchAllListings() {
    try {
      const [activeUserListings, nonActiveUserListings] = await Promise.all([
        getListings(activeUserID),
        getListings(nonActiveUserID),
      ]);
      // console.log("listings retrieved");
      setActiveUserLibrary(activeUserListings);
      setNonActiveUserLibrary(nonActiveUserListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async function updateSwapInfo(currSwap) {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .update(currSwap)
      .eq("pending_swap_id", currSwap.pending_swap_id);
    if (error) {
      // alert("Error", error);
      console.log(error);
    }
    // console.log(data[0]);
    return data[0];
  }

  async function getTransferData() {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("pending_swap_id", info.pending_swap_id);
    return data[0];
  }

  async function updateSwapHistory(currSwap) {
    const { data, error } = await supabase
      .from("Swap_History")
      .insert([currSwap]);
  }

  async function removeData(infoResponse) {
    await Promise.all([
      supabase
        .from("Pending_Swaps")
        .delete()
        .eq("pending_swap_id", infoResponse.pending_swap_id),
      supabase
        .from("Listings")
        .delete()
        .eq("book_id", infoResponse.user1_listing_id),
      supabase
        .from("Listings")
        .delete()
        .eq("book_id", infoResponse.user2_listing_id),
    ]);
  }

  async function rejectBook(pending_swap_id) {
    await Promise.all([
      supabase.from("Notifications").insert([
        {
          type: "Offer_Rejected",
          user_id:
            info.user1_id === session.user.id ? info.user2_id : info.user1_id,
          username: session.user.user_metadata.username,
        },
      ]),
      supabase
        .from("Notifications")
        .delete()
        .eq("swap_offer_id", pending_swap_id),
      supabase
        .from("Pending_Swaps")
        .delete()
        .eq("pending_swap_id", pending_swap_id),
    ]);
  }

  function renderModal(activeUserCheck, user_id, library) {
    return activeUserCheck === true ? (
      <View>
        <View style={{ height: height - (height / 27) * 4 }}>
          <View
            style={{
              justifyContent: "center",
              width: width,
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ ...heading, color: PTG1, textAlign: "center" }}>
                Your Library
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <LinearGradient
                colors={[PTGreen, PTBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 2,
                  width: "100%",
                }}
              ></LinearGradient>
            </View>
          </View>

          <View
            style={{
              flex: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlatList
              data={activeUserLibrary}
              renderItem={({ item }) => (
                <LibraryBookItem
                  book={item}
                  id={item.book_id}
                  inSwapReq={true}
                  activeUserCheck={true}
                  activeUserID={activeUserID}
                  currSwap={currSwap}
                  setCurrSwap={setCurrSwap}
                />
              )}
              keyExtractor={(item) => item.book_id.toString()}
              vertical={true}
              pagingEnabled
              snapToAlignment="center"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ height: "100%", alignSelf: "center" }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    ) : (
      <View>
        <View style={{ height: height - (height / 27) * 4 }}>
          <View
            style={{
              justifyContent: "center",
              width: width,
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ ...heading, color: PTG1, textAlign: "center" }}>
                {session.user.id === info.user1_id
                  ? info.user2_username
                  : info.user1_username}
                {`'s Library`}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <LinearGradient
                colors={[PTGreen, PTBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 2,
                  width: "100%",
                }}
              ></LinearGradient>
            </View>
          </View>

          <View
            style={{
              flex: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlatList
              data={nonActiveUserLibrary}
              renderItem={({ item }) => (
                <LibraryBookItem
                  book={item}
                  id={item.book_id}
                  inSwapReq={true}
                  activeUserCheck={false}
                  activeUserID={activeUserID}
                  currSwap={currSwap}
                  setCurrSwap={setCurrSwap}
                />
              )}
              keyExtractor={(item) => item.book_id.toString()}
              vertical={true}
              pagingEnabled
              snapToAlignment="center"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ height: "100%", alignSelf: "center" }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderSwap(currType, info) {
    switch (currType) {
      case "received":
        return (
          <View style={{ justifyContent: "space-between" }}>
            <View style={styles.booksAndArrows}>
              <Pressable
                style={
                  user1_book_imgurl
                    ? styles.bookCard
                    : {
                        ...styles.bookCard,
                        borderWidth: 2,
                        borderColor: PTG1,
                        borderStyle: "dashed",
                        justifyContent: "center",
                      }
                }
                onPress={() => {
                  setActiveUserCheck(true);
                  setModalUserID(activeUserID);
                  setModalLibrary(activeUserLibrary);
                  setIsModalVisible(true);
                }}
              >
                {user1_book_imgurl ? (
                  <Image
                    source={{
                      uri: user1_book_imgurl,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text
                    style={{ ...heading, color: PTG1, textAlign: "center" }}
                  >
                    ?
                  </Text>
                )}
                {user1_listing_id && (
                  <View
                    style={{
                      height: (14 * pageHeight) / 27 - (5 * containerWidth) / 9,
                      width: "100%",
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
                        ...body,
                        fontWeight: "600",
                      }}
                    >
                      {user1_book_title}
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
                        ...body,
                      }}
                    >
                      {user1_author}
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
                        ...body,
                      }}
                    >
                      Condition:
                    </Text>
                    <Text
                      style={{
                        ...body,
                      }}
                    >
                      {user1_condition}
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
                        ...body,
                      }}
                    >
                      {user1_category}
                    </Text>
                  </View>
                )}
              </Pressable>

              <View style={{ justifyContent: "center" }}>
                <Octicons
                  name="arrow-switch"
                  size={36}
                  color={PTG1}
                  style={{ textAlign: "center", width: "100%" }}
                />
              </View>

              <Pressable
                style={
                  user2_book_imgurl
                    ? styles.bookCard
                    : {
                        ...styles.bookCard,
                        borderWidth: 2,
                        borderColor: PTG1,
                        borderStyle: "dashed",
                        justifyContent: "center",
                      }
                }
                onPress={() => {
                  setActiveUserCheck(false);
                  setModalUserID(nonActiveUserID);
                  setModalLibrary(nonActiveUserLibrary);
                  setIsModalVisible(true);
                }}
              >
                {user2_book_imgurl ? (
                  <Image
                    source={{
                      uri: user2_book_imgurl,
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text
                    style={{ ...heading, color: PTG1, textAlign: "center" }}
                  >
                    ?
                  </Text>
                )}
                {user2_listing_id && (
                  <View
                    style={{
                      height: (14 * pageHeight) / 27 - (5 * containerWidth) / 9,
                      width: "100%",
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
                        ...body,
                        fontWeight: "600",
                      }}
                    >
                      {user2_book_title}
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
                        ...body,
                      }}
                    >
                      {user2_author}
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
                        ...body,
                      }}
                    >
                      Condition:
                    </Text>
                    <Text
                      style={{
                        ...body,
                      }}
                    >
                      {user2_condition}
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
                        ...body,
                      }}
                    >
                      {user2_category}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      width: width,
                      height: (height / 27) * 2,
                      backgroundColor: PTGreen,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="chevron-double-down"
                      size={36}
                      color={PTG1}
                      style={{ alignSelf: "center" }}
                      onPress={() => {
                        setIsModalVisible(false);
                      }}
                    />
                  </View>
                  {renderModal(activeUserCheck, modalUserID, modalLibrary)}
                  
                  <View
                    style={{
                      width: width,
                      height: (height / 27) * 2,
                      backgroundColor: PTGreen,
                    }}
                  >
                  </View>

                </View>
              </Modal>
            </View>

            <View
              style={{
                height: (14 * pageHeight) / 27 - (5 * containerWidth) / 9,
                width: "100%",
                justifyContent: "space-between",
                backgroundColor: PTRed,
              }}
            ></View>
          </View>
        );
      case "sent":
        return (
          <View style={styles.booksAndArrows}>
            <Pressable
              style={
                user2_book_imgurl
                  ? styles.bookCard
                  : {
                      ...styles.bookCard,
                      borderWidth: 2,
                      borderColor: PTG1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                    }
              }
              onPress={() => {
                setActiveUserCheck(true);
                setModalUserID(activeUserID);
                setModalLibrary(activeUserLibrary);
                setIsModalVisible(true);
              }}
            >
              {user2_book_imgurl ? (
                <Image
                  source={{
                    uri: user2_book_imgurl,
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ ...heading, color: PTG1, textAlign: "center" }}
                  >
                    ?
                  </Text>
                </View>
              )}

              {user2_listing_id && (
                <View
                  style={{
                    height: (14 * pageHeight) / 27 - (5 * containerWidth) / 9,
                    width: "100%",
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
                      ...body,
                      fontWeight: "600",
                    }}
                  >
                    {user2_book_title}
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
                      ...body,
                    }}
                  >
                    {user2_author}
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
                      ...body,
                    }}
                  >
                    Condition:
                  </Text>
                  <Text
                    style={{
                      ...body,
                    }}
                  >
                    {user2_condition}
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
                      ...body,
                    }}
                  >
                    {user2_category}
                  </Text>
                </View>
              )}
            </Pressable>

            <View style={{ justifyContent: "center" }}>
              <Octicons
                name="arrow-switch"
                size={36}
                color={PTG1}
                style={{ textAlign: "center", width: "100%" }}
              />
            </View>

            <Pressable
              style={
                user1_book_imgurl
                  ? styles.bookCard
                  : {
                      ...styles.bookCard,
                      borderWidth: 2,
                      borderColor: PTG1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                    }
              }
              onPress={() => {
                setActiveUserCheck(false);
                setModalUserID(nonActiveUserID);
                setModalLibrary(nonActiveUserLibrary);
                setIsModalVisible(true);
              }}
            >
              {user1_book_imgurl ? (
                <Image
                  source={{
                    uri: user1_book_imgurl,
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: PTRed,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{ ...heading, color: PTG1, textAlign: "center" }}
                  >
                    ?
                  </Text>
                </View>
              )}
              {user1_listing_id && (
                <View
                  style={{
                    height: (14 * pageHeight) / 27 - (5 * containerWidth) / 9,
                    width: "100%",
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
                      ...body,
                      fontWeight: "600",
                    }}
                  >
                    {user1_book_title}
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
                      ...body,
                    }}
                  >
                    {user1_author}
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
                      ...body,
                    }}
                  >
                    Condition:
                  </Text>
                  <Text
                    style={{
                      ...body,
                    }}
                  >
                    {user1_condition}
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
                      ...body,
                    }}
                  >
                    {user1_category}
                  </Text>
                </View>
              )}
            </Pressable>

            <Modal isVisible={isModalVisible}>
              <View style={styles.modal}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: width,
                    height: (height / 27) * 2,
                    backgroundColor: PTGreen,
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-double-down"
                    size={36}
                    color={PTG1}
                    style={{ alignSelf: "center" }}
                    onPress={() => {
                      setIsModalVisible(false);
                    }}
                  />
                </View>

                {renderModal(activeUserCheck, modalUserID, modalLibrary)}

                <View
                    style={{
                      width: width,
                      height: (height / 27) * 2,
                      backgroundColor: PTGreen,
                    }}
                  >
                  </View>

              </View>
            </Modal>
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={page}>
      <View style={{ height: pageHeight, alignItems: "center" }}>
        <View style={{ flex: headerFlex, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Your Offer
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.profilePics}>
            <View style={styles.picAndName}>
              <Image
                source={
                  activeUserID === info.user1_id
                    ? user1ProfilePic
                    : user2ProfilePic
                }
                style={styles.profileImg}
              />
              <View
                style={{
                  height: (7 * pageHeight) / 27 - (10 * containerWidth) / 27,
                  justifyContent: "center",
                }}
              >
                <Text style={{ ...subHeading, textAlign: "center" }}>
                  {activeUserID === info.user1_id
                    ? info.user1_username
                    : info.user2_username}
                </Text>
              </View>
            </View>

            <View
              style={{
                height: (10 * containerWidth) / 27,
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              <Pressable
                onPress={() => {
                  navigation.navigate("ChatWindow", {
                    sender: nonActiveUserID,
                    receiver: activeUserID,
                    username:
                      activeUserID === info.user1_id
                        ? info.user2_username
                        : info.user1_username,
                    session: session,
                  });
                }}
                key={
                  activeUserID === info.user1_id
                    ? info.user2_username
                    : info.user1_username}
                style={roundButton}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={30}
                  color={PTG1}
                  style={{ textAlign: "center", width: "100%" }}
                />
              </Pressable>
            </View>

            <View style={styles.picAndName}>
              <Image
                source={
                  activeUserID === info.user1_id
                    ? user2ProfilePic
                    : user1ProfilePic
                }
                style={styles.profileImg}
              />
              <View
                style={{
                  height: (7 * pageHeight) / 27 - (10 * containerWidth) / 27,
                  justifyContent: "center",
                }}
              >
                <Text style={{ ...subHeading, textAlign: "center" }}>
                  {activeUserID === info.user1_id
                    ? info.user2_username
                    : info.user1_username}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.books}>{renderSwap(currType, info)}</View>
        {/* Experimental */}

        <View style={styles.buttons}>
          {/* <Pressable
            style={styles.accept}
            onPress={() => {
              getTransferData()
                .then((res) => {
                  updateSwapHistory(res);
                  return res;
                })
                .then((res) => {
                  removeData(res);
                })
                .then(() => {
                  navigation.navigate("Home");
                });
            }}
          >
            <Text style={styles.body}>Accept</Text>
          </Pressable> */}

          {/* <Pressable
            style={styles.reconsider}
            onPress={() => {
              getTransferData().then((res) => {
                navigation.navigate("ReconsiderLibrary", {
                  info: res,
                  setReconsidered: setReconsidered,
                  setTimeKey: setTimeKey,
                });
              });
            }}
          >
            <Text style={styles.body}>Reconsider</Text>
          </Pressable> */}

          <Pressable
            style={{
              ...pillButton,
              backgroundColor: PTRed,
              width: (7 * width) / 27,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              rejectBook(pending_swap_id);
              navigation.navigate("Home");
            }}
          >
            <Text style={body}>Reject Offer</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: width,
    height: height,
    alignSelf: "center",
    backgroundColor: PTG4,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: JosefinSans_400Regular,
    color: "white",
  },
  page: {
    backgroundColor: "#272727",
    flex: 0.91,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    width: containerWidth,
    justifyContent: "space-between",
    flex: userInfoFlex,
  },
  profilePics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  books: {
    justifyContent: "space-between",
    width: containerWidth,
    flex: booksFlex,
  },
  buttons: {
    flex: buttonsFlex,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  booksAndArrows: {
    flexDirection: "row",
    height: (5 * containerWidth) / 9,
    justifyContent: "space-between",
  },
  bookContainer: {
    margin: 0,
    borderColor: "gray",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    width: 120,
    // borderRadius: 16,
  },
  profileImg: {
    // borderRadius: containerWidth / 6,
    // height: containerWidth / 3,
    // width: containerWidth / 3,
    borderRadius: (10 * containerWidth) / 54,
    height: (10 * containerWidth) / 27,
    width: (10 * containerWidth) / 27,
    resizeMode: "cover",
  },
  bookCard: {
    // borderRadius: 16,
    height: (5 * containerWidth) / 9,
    width: (10 * containerWidth) / 27,
    resizeMode: "contain",
  },
  pick_book: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#06A77D",
    borderRadius: 16,
    height: 180,
    width: 120,
    resizeMode: "contain",
  },
  arrows: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  picAndName: {
    justifyContent: "center",
  },
  body: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontFamily: JosefinSans_400Regular,
    color: "white",
  },
  accept: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#06A77D",
    borderRadius: 16.5,
  },
  reconsider: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#4B7095",
    borderRadius: 16.5,
  },
  reject: {
    justifyContent: "center",
    alignItems: "center",
    height: 33,
    width: 100,
    backgroundColor: "#C1514B",
    borderRadius: 16.5,
  },
});
