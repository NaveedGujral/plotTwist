import { useFonts } from "expo-font";
import { StyleSheet, Image, Text } from "react-native";
import {
  JosefinSans_400Regular,
  JosefinSans_300Light,
} from "@expo-google-fonts/dev";
import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");
const pageHeight = height - (height / 27) * 4;

function LogoW() {
  const logoW = 576;
  const logoH = 96;
  const targetBannerHeight = height / 27;
  const resizeVal = targetBannerHeight / logoH;
  return (
    <Image
      source={require("./assets/Logos/Banner2W1X.png")}
      style={{
        resizeMode: "contain",
        flex: 1,
        height: resizeVal * logoH,
        width: resizeVal * logoW,
      }}
    />
  );
}

function importFonts() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_300Light,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
}

const PTSwatches = {
  PTGreen: "#06A77D",
  PTBlue: "#4B7095",
  PTRed: "#C2524B",
  PTG1: "#E8E5E2",
  PTG2: "#636363",
  PTG3: "#3c3c3b",
  PTG4: "#262626",
};

const PTStyles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: PTSwatches.PTG1,
    fontFamily: "JosefinSans_400Regular",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "100",
    color: PTSwatches.PTG1,
    fontFamily: "JosefinSans_300Light",
  },
  body: {
    fontSize: 16,
    fontWeight: "100",
    color: PTSwatches.PTG1,
    fontFamily: "JosefinSans_300Light",
    lineHeight: 18
  },
  page: {
    backgroundColor: PTSwatches.PTG4,
    height: height - (height / 27) * 4,
    width: width,
  },
  gradTile: {
    borderRadius: width / 18,
    overflow: "hidden",
    width: width - 2*width/27,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tileHeaderBox: {
    fontSize: 18,
    color: PTSwatches.PTG1,
    fontFamily: "JosefinSans_300Light",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
  },
  tileImage: {
    height: 3*width/4.5,
    width: 4*width/9,
    resizeMode: "cover",
  },
  // webFix: {
  //   marginBottom: height * 0.09,
  //   backgroundColor: PTSwatches.PTG4,
  // },
  pillButton: {
    height:4*pageHeight/81,
    borderRadius: 2*pageHeight/81,
  },
  roundButton: {
    width: 4*width/27,
    height: 4*width/27,
    borderRadius: 2*width/27,
    backgroundColor: PTSwatches.PTGreen,
    justifyContent: "center",
    alignContent: "center",
  },
  roundButtonPressed: {
    width: 4*width/27,
    height: 4*width/27,
    borderRadius: 2*width/27,
    backgroundColor: PTSwatches.PTG2,
    justifyContent: "center",
    alignContent: "center",
  },
});

const headerSS = {
  headerTitle: (props) => <LogoW {...props} />,
  headerTitleAlign: "center",
  headerTintColor: PTSwatches.PTG1,
  headerStyle: {
    borderWidth: 0,
    height: (height / 27) * 2,
    backgroundColor: PTSwatches.PTGreen,
  },
};

module.exports = { PTStyles, PTSwatches, headerSS, importFonts };
