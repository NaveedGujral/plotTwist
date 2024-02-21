import { Text, StyleSheet, Pressable, View, Image } from "react-native";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

const { PTStyles, PTSwatches } = require("../Styling");
const { heading, subHeading, body, page } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");

const pageHeight = height - (height / 27) * 4;
const viewHeight = (7 * pageHeight) / 18;
const containerHeight = (9 * viewHeight) / 10;
const cardContainerHeight = containerHeight / 1.5;
const containerWidth = width - (2 * width) / 27;
const profilePicDims = cardContainerHeight - (2 * cardContainerHeight) / 9;

export default function ListedBook({ route, userName }) {
  const navigation = useNavigation();
  const { session, listing } = route;
  const [swapState, setSwapState] = useState(false);
  const [swapRequestMade, setSwapRequestMade] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState();

  console.log(listing);

  useEffect(() => {
    switch (listing.user_id) {
      case "10240ee4-1b43-4749-afbe-1356c83af4da":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Nav.jpg")
        );
        break;
      case "a4624164-bbbb-4cb6-b199-06b2fdd6f14a":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Jake.jpg")
        );
        break;
      case "c563d513-b021-42f2-a3b3-77067b8547af":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Jay.jpg")
        );
        break;
      case "ce083d4c-a1e8-45d0-9f93-6bc092f7155b":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Ana.jpg")
        );
        break;
      case "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Alicia.jpg")
        );
        break;
      case "b45b3687-4e73-46e2-8474-da10e307691b":
        setUserProfilePic(
          require("../assets/ExampleUserProfilePictures/Faith.jpg")
        );
        break;
    }
  }, []);

  async function checkSwapExists() {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select()
      .eq("user1_id", listing.user_id)
      .eq("user2_id", session.user.id)
      .eq("user1_listing_id", listing.book_id);

    if (data.length > 0) {
      setSwapState(true);
    } else {
      setSwapState(false);
    }
  }

  // inserts info into pending swaps
  const reqSwap = async () => {
    if (swapState) {
      return;
    }
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .insert([
        {
          user1_id: listing.user_id,
          user1_book_title: listing.book_title,
          user1_listing_id: listing.book_id,
          user1_book_imgurl: listing.img_url,
          user1_username: userName,
          user2_id: session.user.id,
          user2_username: session.user.user_metadata.username,
        },
      ])
      .select("pending_swap_id");

    if (error) {
      console.error("Failed to make swap request: ", error);
    } else {
      console.log("Data inserted: ", data);
    }
    setSwapState(true);
    return data[0].pending_swap_id;
  };

  const sendNotification = async (id) => {
    if (swapState) {
      return;
    }
    const { data, error } = await supabase.from("Notifications").insert([
      {
        swap_offer_id: id,
        type: "Swap_Request",
        user_id: listing.user_id,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}></View>
      <View
        style={{
          flex: 7,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* <View
          style={{
            width: profilePicDims,
            height: profilePicDims,
            backgroundColor: PTBlue,
            borderRadius: profilePicDims / 2,
          }}
        > */}
          <Image
            source={userProfilePic}
            style={{
              width: profilePicDims,
              height: profilePicDims,
              borderRadius: profilePicDims / 2,
              resizeMode: "cover",
            }}
          />
        {/* </View> */}
        <View
          style={{
            width: containerWidth - (profilePicDims + width / 27),
            height: profilePicDims,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={subHeading}>{userName}</Text>
            <Text style={{ ...subHeading, color: PTSwatches.PTG2 }}>
              {new Date(listing.date_posted).toLocaleDateString()}{" "}
            </Text>
          </View>
          <Text style={subHeading}> </Text>
          <Text style={subHeading}>Condition: {listing.condition} </Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            height: height / 729,
            width: "100%",
            backgroundColor: PTG2,
          }}
        ></View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={subHeading}>
        {" "}
        Posted by {userName} on{" "}
        {new Date(listing.date_posted).toLocaleDateString()}{" "}
      </Text>
      <Text style={subHeading}> Condition is {listing.condition} </Text>
      <Pressable
        onPress={() => {
          Promise.all([checkSwapExists(), reqSwap()]).then(
            ([checkResults, reqResults]) => {
              sendNotification(reqResults);
            }
          );
          setSwapRequestMade(true);
        }}
        style={styles.descriptionButton}
      >
        <View>
          <Text
            style={
              swapRequestMade ? styles.requestSwapButtonPressed : styles.text
            }
          >
            {" "}
            {swapRequestMade ? "Request Made" : "Request swap"}
          </Text>
        </View>
      </Pressable>
      <View
        style={{ height: height / 729, width: "100%", backgroundColor: PTG2 }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: containerWidth,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  button: {
    borderWidth: 2,
    borderColor: "blue",
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
  requestSwapButtonPressed: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "black",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
});
