import { AntDesign, Octicons } from "@expo/vector-icons";
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
  TextInput,
} from "react-native";
import { Input } from "react-native-elements";
import supabase from "../config/supabaseClient";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  buttonText,
  pillButton,
  roundButton,
  roundButtonPressed,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { width, height } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const containerWidth = width - (2 * width) / 27;

const userImageMap = {
  "2f71dabd-2f9c-48c3-8edd-4ae7495f59ce": require("../assets/ExampleUserProfilePictures/Alicia.jpg"),
  "c563d513-b021-42f2-a3b3-77067b8547af": require("../assets/ExampleUserProfilePictures/Jay.jpg"),
  "a4624164-bbbb-4cb6-b199-06b2fdd6f14a": require("../assets/ExampleUserProfilePictures/Jake.jpg"),
  "10240ee4-1b43-4749-afbe-1356c83af4da": require("../assets/ExampleUserProfilePictures/Nav.jpg"),
  "ce083d4c-a1e8-45d0-9f93-6bc092f7155b": require("../assets/ExampleUserProfilePictures/Ana.jpg"),
  "b45b3687-4e73-46e2-8474-da10e307691b": require("../assets/ExampleUserProfilePictures/Faith.jpg"),
};

export default function UserProfile({ route }) {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState();
  const [editing, setIsEditing] = useState(false);
  const [exists, setExists] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const { session } = route.params;
  const [activeSaveButton, setActiveSaveButton] = useState();

  useEffect(() => {
    setActiveSaveButton(false);
    async function compareId(id) {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .match({ user_id: id });
      return data;
    }

    if (userImageMap.hasOwnProperty(session.user.id)) {
      setProfilePicture(userImageMap[session.user.id]);
    } else {
      console.log("no image found");
    }

    async function getData() {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;
      setUsername(session.user.user_metadata.username);
      setEmail(session.user.email);
      setId(session.user.id);
      return session.user.id;
    }
    getData()
      .then((id) => {
        return compareId(id);
      })
      .then((data) => {
        if (data.length > 0) {
          setExists(true);
          setUsername(data[0].username);
          setEmail(data[0].email_address);
          setPhone(data[0].phone_number);
        }
      });
  }, [session.user_id]);

  //   useEffect(() => {
  //     setActiveSaveButton(true)
  //   }, [username])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out: ", error);
    } else {
      useNavigation.replace("Login");
    }
  };

  async function sendNewData() {
    const { data, error } = await supabase
      .from("Users")
      .insert([
        { username: username, email_address: email, phone_number: phone },
      ])
      .select();
  }

  async function updateUserData(userid) {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", userid);
    if (data.length > 0) {
      await supabase
        .from("Users")
        .update({
          username: username,
          email_address: email,
          phone_number: phone,
        })
        .eq("user_id", userid);
    } else {
      sendNewData();
    }
  }

  async function updateSessionUserData() {
    const { data, error } = await supabase.auth.updateUser({
      email: email,
      phone: phone,
      data: {
        username: username,
      },
    });
  }

  //   if (editing) {
  //     return (
  //       <View>
  //         <View>
  //           <Input
  //             title="Username"
  //             placeholder="Username"
  //             value={username}
  //             onChangeText={(text) => {
  //               setUsername(text);
  //             }}
  //           />
  //         </View>
  //         <View style={styles.edit_container}>
  //           <Input
  //             title="Email"
  //             placeholder="Email"
  //             value={email}
  //             onChangeText={(text) => {
  //               setEmail(text);
  //             }}
  //           />
  //         </View>
  //         <View>
  //           <Input
  //             title="Phone Number"
  //             placeholder="+44.............."
  //             value={phone}
  //             inputMode="numeric"
  //             onChangeText={(text) => {
  //               setPhone(text);
  //             }}
  //           />
  //         </View>

  //         <View style={styles.buttonContainer}>
  //           <Pressable
  //             onPress={() => {
  //               setIsEditing(false);
  //               if (id) {
  //                 updateUserData(id);
  //                 update;
  //               } else {
  //                 sendNewData();
  //               }
  //               updateSessionUserData;
  //             }}
  //             style={styles.edit_button}
  //           >
  //             <AntDesign name="save" size={24} color="black" />
  //           </Pressable>
  //         </View>
  //       </View>
  //     );
  //   }

  console.log(activeSaveButton);

  return (
    <View style={page}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            ...heading,
            textAlign: "center",
          }}
        >
          Your Profile
        </Text>
      </View>
      <View style={{ flex: 8, alignItems: "center" }}>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            width: containerWidth,
            gap: width / 27,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image source={profilePicture} style={styles.profilePicture} />
        </View>
        <View style={{ flex: 3, width: containerWidth, alignItems: "center" }}>
          <View style={styles.inputContainer}>
            <Text style={{ ...subHeading, paddingLeft: 15 }}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={(newText) => {
                setUsername(newText);
                setActiveSaveButton(true);
              }}
              value={username}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ ...subHeading, paddingLeft: 15 }}>
              Phone Number:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={(newText) => {
                setPhone(newText.toString());
                setActiveSaveButton(true);
              }}
              value={phone}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ ...subHeading, paddingLeft: 15 }}>
              Email Address:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              onChangeText={(newText) => {
                setEmail(newText);
                setActiveSaveButton(true);
              }}
              value={email}
            />
          </View>
        </View>

        <View
          style={{
            flex: 3,
            width: containerWidth,
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          {activeSaveButton === true ? (
            <Pressable
              onPress={() => {
                if (id) {
                  updateUserData(id);
                  //   update;
                } else {
                  sendNewData();
                }
                updateSessionUserData;
                setActiveSaveButton(false);
              }}
              style={{
                ...roundButton,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="save" size={36} color={PTG1} />
            </Pressable>
          ) : (
            <View
              style={{
                ...roundButtonPressed,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="save" size={36} color={PTG4} />
            </View>
          )}
          <Pressable
            onPress={() => {
              handleSignOut();
            }}
            style={{
              ...roundButton,
              backgroundColor: PTRed,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Octicons name="sign-out" size={36} color={PTG1} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: pageHeight / 9,
    justifyContent: "space-around",
  },
  input: {
    ...subHeading,
    color: PTG4,
    height: (4 * pageHeight) / 81,
    width: containerWidth,
    borderRadius: (2 * pageHeight) / 81,
    padding: 15,
    backgroundColor: PTG1,
  },
  gradientContainer: {
    marginTop: 10,
    width: screenWidth - 20,
    marginLeft: 10,
    marginTop: 20,
  },
  background: {
    backgroundColor: "#272727",
    height: screenHeight,
    width: screenWidth,
  },
  username: {
    marginLeft: 5,
    fontSize: 36,
    marginTop: 20,
    marginBottom: 20,
    textDecorationLine: "underline",
    fontFamily: "JosefinSans_400Regular",
    color: "white",
  },
  email: {
    fontSize: 24,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: "JosefinSans_400Regular",
    color: "white",
  },
  phone: {
    fontSize: 24,
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 10,
    fontFamily: "JosefinSans_400Regular",
    color: "white",
  },
  edit_button: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: "grey",
    borderWidth: 2,
    padding: 4,
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  contact_info: {
    marginLeft: 5,
    marginTop: 20,
    textDecorationLine: "underline",
    fontSize: 34,
    marginBottom: 8,
    fontFamily: "JosefinSans_400Regular",
    color: "white",
  },
  title: {
    marginLeft: 7,
    marginTop: 10,
    marginBottom: 30,
    fontSize: 24,
    fontFamily: "JosefinSans_400Regular",
    color: "white",
  },
  edit_container: {
    marginTop: 30,
  },
  profilePicture: {
    width: (2 * pageHeight) / 9,
    height: (2 * pageHeight) / 9,
    borderRadius: pageHeight / 9,
  },
  logout: {
    borderRadius: 5,
    padding: 15,
    marginTop: 30,
    backgroundColor: "#C1514B",
    width: 90,
    alignItems: "center",
    alignSelf: "center",
    color: "white",
    text: { color: "white", fontFamily: "JosefinSans_400Regular" },
  },
});
