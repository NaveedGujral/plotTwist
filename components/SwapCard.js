import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
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
const renderHeaderHeight = (6 * height) / 81;
const renderContentHeight = (9 * pageHeight) / 10 - 3 * renderHeaderHeight;
const cardHeight = renderContentHeight / 3.5;
const cardWidth = width - (2 * width) / 27;

export default function SwapCard({ swap, type, userID, session, navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("SwapNegotiationPage", {
          user1_book: swap,
          user2_book: swap,
          info: swap,
          session: session,
        });
      }}
    >
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
            backgroundColor: PTG4,
          }}
        ></View>
      </View>
      <View style={styles.card}>
        
        {/* Incoming Requests */}

        <Image
          source={{ uri: swap.user1_book_imgurl }}
          style={styles.bookImg}
        />
        <View style={{ justifyContent: "center" }}>
          <Octicons
            name="arrow-switch"
            size={24}
            color={PTG1}
            style={{ textAlign: "center", width: "100%" }}
          />
        </View>
        <View
          style={{
            ...styles.bookImg,
            borderWidth: 2,
            borderColor: PTG1,
            borderStyle: "dashed",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...heading, color: PTG1 }}>?</Text>
        </View>
        <View style={{ width: (4 * cardWidth) / 9 }}>
          <Text
            style={{
              ...body,
              textAlign:"left"
            }}
          >
            {swap.user2_username} requests 
          </Text>
          <Text
            style={{
              ...body,
              textAlign:"left"
            }}
          >
            {swap.user1_book_title}
          </Text>
            
        </View>

        {/* Incoming Requests */}

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
    </Pressable>
  );

  switch (type) {
    case "received":
      return (
        <Pressable
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapNegotiationPage", {
              user1_book: swap,
              user2_book: swap,
              info: swap,
              session: session,
            });
          }}
        >
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              marginBottom: 25,
            }}
          >
            <View
              style={Platform.OS === "ios" ? styles.cardMobile : styles.card}
            >
              <Image
                source={{ uri: swap.user1_book_imgurl }}
                style={styles.bookImg}
              />
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>
                    From:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {swap.user2_username}
                    </Text>
                  </Text>
                  <Text style={styles.headerText}>
                    {swap.offer_date.split("T")[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={styles.messageBorder}>
                    <Text style={styles.message}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user2_username}
                      </Text>{" "}
                      has requested to swap your copy of{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_book_title}
                      </Text>
                      !
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      );
    case "sent":
      return (
        <Pressable
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapNegotiationPage", {
              user1_book: swap,
              user2_book: swap,
              info: swap,
              session: session,
            });
          }}
        >
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              marginBottom: 25,
            }}
          >
            <View
              style={Platform.OS === "ios" ? styles.cardMobile : styles.card}
            >
              <Image
                source={{ uri: swap.user1_book_imgurl }}
                style={styles.bookImg}
              />
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>
                    To:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {swap.user1_username}
                    </Text>
                  </Text>
                  <Text style={styles.headerText}>
                    {swap.offer_date.split("T")[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={styles.messageBorder}>
                    <Text style={styles.message}>
                      You have made a swap request to{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_username}
                      </Text>{" "}
                      for their copy of{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_book_title}
                      </Text>
                      !
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      );
    case "activeRecieved":
      return (
        <Pressable
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapNegotiationPage", {
              user1_book: swap,
              user2_book: swap,
              info: swap,
              session: session,
            });
          }}
        >
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              marginBottom: 25,
            }}
          >
            <View
              style={
                Platform.OS === "ios"
                  ? styles.cardActiveMobile
                  : styles.cardActive
              }
            >
              <View style={styles.textContent}>
                <View style={{ ...styles.header, marginHorizontal: 17 }}>
                  <Text style={styles.headerText}>
                    Active Swap With:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {swap.user2_username}
                    </Text>
                  </Text>
                  <Text style={styles.headerText}>
                    {swap.offer_date.split("T")[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={{ ...styles.messageBorder, marginVertical: 20 }}>
                    <Text style={styles.message}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user2_username}
                      </Text>{" "}
                      would Like your copy of{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_book_title}
                      </Text>
                      . You are currently offering{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user2_book_title}
                      </Text>{" "}
                      in return.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.dealGraphic}>
                <Image
                  source={{ uri: swap.user1_book_imgurl }}
                  style={styles.bookImg}
                />
                <MaterialIcons
                  name="swap-vert-circle"
                  size={50}
                  color="white"
                  style={{ marginHorizontal: 30 }}
                />
                <Image
                  source={{ uri: swap.user2_book_imgurl }}
                  style={styles.bookImg}
                />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      );
    case "activeSent":
      return (
        <Pressable
          style={styles.container}
          onPress={() => {
            navigation.navigate("SwapNegotiationPage", {
              user1_book: swap,
              user2_book: swap,
              info: swap,
              session: session,
            });
          }}
        >
          <LinearGradient
            colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 30,
              overflow: "hidden",
              marginBottom: 25,
            }}
          >
            <View
              style={
                Platform.OS === "ios"
                  ? styles.cardActiveMobile
                  : styles.cardActive
              }
            >
              <View style={styles.textContent}>
                <View style={{ ...styles.header, marginHorizontal: 17 }}>
                  <Text style={styles.headerText}>
                    Active Swap With:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontFamily: "JosefinSans_400Regular",
                      }}
                    >
                      {swap.user1_username}
                    </Text>
                  </Text>
                  <Text style={styles.headerText}>
                    {swap.offer_date.split("T")[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={{ ...styles.messageBorder, marginVertical: 20 }}>
                    <Text style={styles.message}>
                      You have made a swap request for{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_username}
                      </Text>
                      's copy of{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user1_book_title}
                      </Text>
                      . They would like{" "}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontFamily: "JosefinSans_400Regular",
                        }}
                      >
                        {swap.user2_book_title}
                      </Text>{" "}
                      in return.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.dealGraphic}>
                <Image
                  source={{ uri: swap.user2_book_imgurl }}
                  style={styles.bookImg}
                />
                <MaterialIcons
                  name="swap-vert-circle"
                  size={50}
                  color="white"
                  style={{ marginHorizontal: 30 }}
                />
                <Image
                  source={{ uri: swap.user1_book_imgurl }}
                  style={styles.bookImg}
                />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: cardHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    width: cardWidth,
    height: cardHeight - (2 * width) / 27,
    justifyContent: "space-between",
  },
  cardMobile: {
    // flex: 1,
    flexDirection: "row",
    width: width * 0.9,
    borderRadius: 20,
    padding: 10,
    height: 200,
    backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardActive: {
    flex: 1,
    width: width * 0.9,
    borderRadius: 20,
    padding: 10,
    // height: 200,
    // backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardActiveMobile: {
    // flex: 1,
    width: width * 0.9,
    borderRadius: 20,
    padding: 10,
    height: 300,
    // backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  bookImg: {
    height: cardHeight - (2 * width) / 27,
    width: (2 * (cardHeight - (2 * width) / 27)) / 3,
    borderRadius: (cardHeight - (2 * width) / 27) / 9,
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  headerText: {
    textAlign: "right",
    color: "white",
    fontSize: 15,
    fontFamily: "JosefinSans_400Regular",
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontFamily: "JosefinSans_400Regular",
    color: "white",
    textAlign: "justify",
    marginHorizontal: 10,
  },
  messageBorder: {
    padding: 10,
    marginHorizontal: 10,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#06A77D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  hr: {
    borderBottomWidth: 1,
  },
  dealGraphic: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
