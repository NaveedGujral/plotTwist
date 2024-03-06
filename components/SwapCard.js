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
const renderHeaderHeight = (2 * height) / 27;
const renderContentHeight = (8 * pageHeight) / 9 - 3 * renderHeaderHeight;
const cardHeight = renderContentHeight / 3.5;
const cardWidth = width - (2 * width) / 27;

export default function SwapCard({ swap, type, session, navigation }) {
  const sessionUserId = session.user.id;

  function renderContent(type, swap) {
    switch (type) {
      case "received":
        return (
          <>
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
                  textAlign: "left",
                }}
              >
                {swap.user2_username} wants{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user1_book_title}
                </Text>
              </Text>
            </View>
          </>
        );
      case "sent":
        return (
          <>
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
            <View style={{ justifyContent: "center" }}>
              <Octicons
                name="arrow-switch"
                size={24}
                color={PTG1}
                style={{ textAlign: "center", width: "100%" }}
              />
            </View>
            <Image
              source={{ uri: swap.user1_book_imgurl }}
              style={styles.bookImg}
            />
            <View style={{ width: (4 * cardWidth) / 9 }}>
              <Text
                style={{
                  ...body,
                  textAlign: "left",
                }}
              >
                You want {swap.user1_username}'s{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user1_book_title}
                </Text>
              </Text>
            </View>
          </>
        );
      case "activeReceived":
        return (
          <>
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
            <Image
              source={{ uri: swap.user2_book_imgurl }}
              style={styles.bookImg}
            />
            <View style={{ width: (4 * cardWidth) / 9 }}>
              <Text
                style={{
                  ...body,
                  textAlign: "left",
                }}
              >
                You want to swap{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user1_book_title}
                </Text>{" "}
                for {swap.user2_username}'s{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user2_book_title}
                </Text>
              </Text>
            </View>
          </>
        );
      case "activeSent":
        return (
          <>
            <Image
              source={{ uri: swap.user2_book_imgurl }}
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
            <Image
              source={{ uri: swap.user1_book_imgurl }}
              style={styles.bookImg}
            />
            <View style={{ width: (4 * cardWidth) / 9 }}>
              <Text
                style={{
                  ...body,
                  textAlign: "left",
                }}
              >
                You want to swap{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user2_book_title}
                </Text>{" "}
                for {swap.user1_username}'s{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {swap.user1_book_title}
                </Text>
              </Text>
            </View>
          </>
        );
      case "completed":
        return (
          <>
            <Image
              source={{
                uri:
                  sessionUserId === swap.user1_id
                    ? swap.user1_book_imgurl
                    : swap.user2_book_imgurl,
              }}
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
            <Image
              source={{
                uri:
                  sessionUserId === swap.user1_id
                    ? swap.user2_book_imgurl
                    : swap.user1_book_imgurl,
              }}
              style={styles.bookImg}
            />
            <View style={{ width: (4 * cardWidth) / 9 }}>
              <Text
                style={{
                  ...body,
                  textAlign: "left",
                }}
              >
                You swapped{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {sessionUserId === swap.user1_id
                    ? swap.user1_book_title
                    : swap.user2_book_title}
                </Text>{" "}
                for{" "}
                {sessionUserId === swap.user1_id
                  ? swap.user2_username
                  : swap.user1_username}
                's{" "}
                <Text style={{ fontStyle: "italic" }}>
                  {" "}
                  {sessionUserId === swap.user1_id
                    ? swap.user2_book_title
                    : swap.user1_book_title}
                </Text>
              </Text>
            </View>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (type !== "completed") {
          navigation.navigate("SwapNegotiationPage", {
            user1_book: swap,
            user2_book: swap,
            info: swap,
            session: session,
          });
        }
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
      <View style={styles.card}>{renderContent(type, swap)}</View>
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
            width: width - (2 * width) / 27,
            backgroundColor: PTG2,
          }}
        ></View>
      </View>
    </Pressable>
  );
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardActiveMobile: {
    width: width * 0.9,
    borderRadius: 20,
    padding: 10,
    height: 300,
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
