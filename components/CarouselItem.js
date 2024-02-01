import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const { PTStyles, PTSwatches } = require('../Styling')
const { heading, subHeading, body } = PTStyles
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

export default function CarouselItem({ listing }) {
	console.log(listing)
	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[PTGreen, PTBlue]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					borderRadius: 30,
					overflow: "hidden",
				}}
			>
				{/* <View style={styles.card}>
						<Image style={styles.image} source={{ uri: listing.img_url }} />
				</View> */}
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
        alignItems: "center",
		height: 180 * 1.5,
		width: 120 * 1.5,
		borderRadius: 16,
		marginBottom: 10,
		marginTop: 10,
		resizeMode: "cover",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: screenHeight * 0.4 * 0.9,
		width: screenWidth,
	},
	card: {
		width: screenWidth * 0.9,
		height: 400,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		textAlign: "center",
        paddingHorizontal: 10,
        fontFamily: "JosefinSans_400Regular",
        fontSize: 14,
        paddingHorizontal: 10,

	},
	author: {
		textAlign: "center",
        paddingHorizontal: 10,
        fontFamily: "JosefinSans_400Regular",
        fontSize: 13,
	},
});
