import supabase from "../config/supabaseClient";

import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Input } from "react-native-elements";

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

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    setEmail("");
    setPassword("");
    setUsername("");

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
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
              label="Username"
              leftIcon={{ type: "font-awesome", name: "user", color: "white" }}
              placeholder="Enter username"
              autoCapitalize={"none"}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
              }}
              style={styles.inputField}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
              secureTextEntry={true}
              placeholder="Enter password"
              autoCapitalize={"none"}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              style={styles.inputField}
            />
          </View>

          <Pressable
            onPress={() => signUpWithEmail()}
            style={{
              ...pillButton,
              justifyContent: "center",
              alignItems: "center",
              width: width / 3,
            }}
          >
            <Text style={buttonText}>Sign Up</Text>
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
    gap: pageHeight / 81,
    alignItems: "center",
    backgroundColor: PTG4,
  },
  inputContainer: {
    width: 300,
    marginBottom: 10,
  },
  buttonContainer: {
    width: 200,
  },
  inputField: {
    color: "white",
  },
});
