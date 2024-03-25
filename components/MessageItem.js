import { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
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
const cardHeight = pageHeight / 6.5;
const cardWidth = width - (2 * width) / 27;
const userImageMap = {
  aliciaW: require("../assets/ExampleUserProfilePictures/Alicia.jpg"),
  jaymckerracher: require("../assets/ExampleUserProfilePictures/Jay.jpg"),
  "Jake Robinson": require("../assets/ExampleUserProfilePictures/Jake.jpg"),
  "Naveed Gujral": require("../assets/ExampleUserProfilePictures/Nav.jpg"),
  Ana: require("../assets/ExampleUserProfilePictures/Ana.jpg"),
  faithcollison: require("../assets/ExampleUserProfilePictures/Faith.jpg"),
};

export default function MessageItem(props) {
  // console.log(props)
  const [profilePicture, setProfilePicture] = useState();
  const { usernames, navigation, key, session, id } = props;

  useEffect(() => {
    if (userImageMap.hasOwnProperty(usernames[2])) {
      setProfilePicture(userImageMap[usernames[2]]);
    }
  }, []);

  return (
    <Pressable
      onPress={() => {
        console.log(usernames);
        navigation.navigate("ChatWindow", {
          sender: usernames[0].sender,
          receiver: usernames[1].receiver,
          username: usernames[2],
          session: session,
          key: id,
          profilePicture: profilePicture
        });
      }}
      key={id}
      style={styles.container}
    >
      <View
        style={{
          width: cardWidth,
          height: cardHeight,
          flexDirection: "row",
          alignItems: "center",
          gap: width / 27,
        }}
      >
        <View>
          <Image source={profilePicture} style={styles.profilePicture} />
        </View>
        <View>
          <Text style={heading}>{usernames[2]}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PTG4,
    height: cardHeight,
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    height: (7 * cardHeight) / 9,
    width: (7 * cardHeight) / 9,
    borderRadius: (7 * cardHeight) / 18,
  },
});
