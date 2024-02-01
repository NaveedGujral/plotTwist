import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import {
    JosefinSans_400Regular,
} from "@expo-google-fonts/dev";
import { NativeModules } from "react-native";
import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const PTSwatches = {
    PTGreen: "#06A77D",
    PTBlue: "#4B7095",
    PTRed: "#C2524B",
    PTG1: "#E8E5E2",
    PTG2: "#8C8281",
    PTG3: "#6E6767",
    PTG4: "#262626",
}

const PTStyles = StyleSheet.create({
    heading: {
		fontSize: 27,
		fontWeight: "500",
		color: PTSwatches.PTG1,
		fontFamily: "JosefinSans_400Regular",
	},
    subHeading: {
        fontSize: 18,
        fontWeight: "100",
		color: PTSwatches.PTG1,
		fontFamily: "JosefinSans_400Regular",
    },
    body: {
        fontSize: 12,
        fontWeight: "100",
		color: PTSwatches.PTG1,
		fontFamily: "JosefinSans_400Regular",
    }
})

const headerSS = {
    headerTitle: "",
    headerTintColor: PTSwatches.PTG1,
    headerStyle: {
        borderWidth: 0,
        height: height * 0.06,
        backgroundColor: PTSwatches.PTGreen,
    },
}

module.exports = { PTStyles, PTSwatches, headerSS }