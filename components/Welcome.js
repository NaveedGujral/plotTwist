import { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import supabase from "../config/supabaseClient";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { JosefinSans_400Regular } from "@expo-google-fonts/dev";

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
const LogoW = 2*containerWidth/3;
const LogoH = LogoW

export default function Welcome({ navigation }) {

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session.session.user) {
          navigation.navigate("Drawer", { screen: "Home" });
        }
      } catch (error) {
        console.log("An error occured...", error);
      }
    };

    checkUser();
  }, []);

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

  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <View style={page}>
        <View style={{ flex: 1, width: width, justifyContent:"center", alignItems:"center" }}>
            <Logo />
        </View>

        <View style={{ flex: 1, width: width, alignItems:"center", gap: pageHeight/81 }}>
            <Pressable
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={{...pillButton, justifyContent: "center", alignItems:"center", width:width/3}}
            >
              <Text style={buttonText}>Log In</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("SignUp");
              }}
              style={{...pillButton, justifyContent: "center", alignItems:"center", width:width/3}}
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
  buttonContainer: {
    width: 200,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#272727",
    flex: 1,
  },
  button: {
    backgroundColor: "#06A77D",
    width: 200,
    height: 42,
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 9,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: "#06A77D",
  },
  text: {
    fontSize: 20,
    fontFamily: "JosefinSans_400Regular",
    fontWeight: 500,
    color: "white",
  },
});
