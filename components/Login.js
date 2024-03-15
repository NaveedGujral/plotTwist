import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Pressable
} from "react-native";
import { Button, Input } from "react-native-elements";
import supabase from "../config/supabaseClient";
import Ionicons from "@expo/vector-icons/Ionicons";

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
const pageHeight = height - (height / 27) * 2;
const containerWidth = width - (2 * width) / 27;
const LogoW = (2 * containerWidth) / 3;
const LogoH = LogoW;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      setEmail("");
      setPassword("");
      navigation.navigate("Drawer", { screen: "Home" });
    }
  }

  const Logo = () => (
    <Image
      source={require("../assets/Logos/Logo2C1XNoBlock.png")}
      style={{
        width: LogoW,
        height: LogoH,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );

  return (
    <View>
      <View style={page}>
        <View
          style={{
            flex: 1,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo />
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Input
              label="Email"
              leftIcon={{
                type: "font-awesome",
                name: "envelope",
                color: "white",
              }}
              placeholder="email@address.com"
              autoCapitalize={"none"}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={styles.inputField}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              style={styles.inputField}
            />
          </View>

          <Pressable
            onPress={() => signInWithEmail()}
            style={{
              ...pillButton,
              justifyContent: "center",
              alignItems: "center",
              width: width / 3,
            }}
          >
            <Text style={buttonText}>Log In</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          height: (2 * height) / 27,
          width: width,
          backgroundColor: PTGreen,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272727",
  },
  inputContainer: {
    width: 300,
    marginBottom: 10,
  },
  buttonContainer: {
    width: 200,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#06A77D",
    width: 200,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  inputField: {
    color: "white",
  },
});

//placeholder colour matches background - > change so it doesn't 'dissapear'
