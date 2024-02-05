import { View, StyleSheet, Text, Image, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const ScreenWidth = Dimensions.get("screen").width;
const ScreenHeight = Dimensions.get("screen").height;

const { PTStyles, PTSwatches } = require('../Styling')
const { heading, subHeading, body } = PTStyles
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

export default function CarouselItem({ item }) {
	console.log(item)
	const navigation = useNavigation();
	return (
		<Pressable onPress={() => navigation.navigate("AvailableListings", {listing: item})} style={styles.container}>
			<LinearGradient
				colors={[PTGreen, PTBlue]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.card}
			>
				<View style= {{height: ((ScreenWidth - 20)/6)*1, justifyContent: "center", flex: 1}}>
					<Text style={styles.headerBox}>
						{item.book_title}
					</Text>
				</View>
				<Image style={styles.image} source={{ uri: item.img_url }} />
				<View style= {{height: ((ScreenWidth - 20)/6)*1, justifyContent: "center", flex: 1}}>
					<Text style={{...subHeading, textAlign: "center"}}>
						{item.no_of_wishlists} people want this book
					</Text>
				</View>
			</LinearGradient>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: ScreenWidth - 20,
		width: ScreenWidth,
	},
	headerBox: {
		...subHeading, 
		textAlign: "center", 
		width: ScreenWidth - 35, 
		fontWeight: "bold", 
		overflow: "hidden",
		// height: ((ScreenWidth - 20)/6)*1,
	},
	card: {
		borderRadius: 30,
		overflow: "hidden",
		width: ScreenWidth - 20,
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	image: {
		borderRadius: 20,
		height: ((ScreenWidth - 20)/3)*2,
		width: ((((ScreenWidth - 20)/3)*2)/3)*2,
		resizeMode: "cover",
	},
});
