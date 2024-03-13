import { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
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
  bookImage1,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const userImageMap = {
  "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": require("../assets/ExampleUserProfilePictures/Alicia.jpg"),
  "c563d513-b021-42f2-a3b3-77067b8547af": require("../assets/ExampleUserProfilePictures/Jay.jpg"),
  "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": require("../assets/ExampleUserProfilePictures/Jake.jpg"),
  "10240ee4-1b43-4749-afbe-1356c83af4da": require("../assets/ExampleUserProfilePictures/Nav.jpg"),
  "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": require("../assets/ExampleUserProfilePictures/Ana.jpg"),
  "b45b3687-4e73-46e2-8474-da10e307691b": require("../assets/ExampleUserProfilePictures/Faith.jpg"),
};

export default function MessageItem(props) {

// console.log(props)

const { usernames, navigation, key, session, id } = props

  return (
    <Pressable
      onPress={() => {
        console.log(usernames);
        navigation.navigate("ChatWindow", {
          sender: usernames[0].sender,
          receiver: usernames[1].receiver,
          username: usernames[2],
          session: session,
          key:id
        });
      }}
      key={id}
      style={styles.listItem}
    >
      <Text style={styles.text}>{usernames[2]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PTG4,
    flex: 1,
  },
  listItem: {
    borderBottomColor: PTG2,
    borderBottomWidth: 10,
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
});