import { useFonts } from "expo-font";
import { LogBox, StyleSheet, Image, Pressable, View } from "react-native";
import {
    JosefinSans_400Regular,
    JosefinSans_300Light
} from "@expo-google-fonts/dev";
import { NativeModules } from "react-native";
import { useState, useEffect, useRef } from "react"
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { screenHeight, width } = Dimensions.get("window");

function LogoW() {
    const logoW = 576
    const logoH = 96
    const resizeVal = 32/96
    return (
        <Image source={require('./assets/Logos/Banner2W1X.png')} style={{ resizeMode: 'contain', flex: 1, height: resizeVal*logoH, width: resizeVal*logoW }} />
    )
}

function importFonts() {
    const [fontsLoaded] = useFonts({
		JosefinSans_400Regular,
        JosefinSans_300Light
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
    PTG2: "#8C8281",
    PTG3: "#6E6767",
    PTG4: "#262626",
}

const PTStyles = StyleSheet.create({
    heading: {
		fontSize: 27,
		fontWeight: "400",
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
        fontSize: 12,
        fontWeight: "100",
		color: PTSwatches.PTG1,
		fontFamily: "JosefinSans_300Light",
    },
})

const headerSS = {
    headerTitle: (props) => <LogoW {...props} />,
    headerTitleAlign: "center",
    headerTintColor: PTSwatches.PTG1,
    headerStyle: {
        borderWidth: 0,
        screenHeight: screenHeight * 0.06,
        backgroundColor: PTSwatches.PTGreen,
    },
}

module.exports = { PTStyles, PTSwatches, headerSS, importFonts }