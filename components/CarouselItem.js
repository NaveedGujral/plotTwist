import { View, StyleSheet, Text, Image, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const { PTStyles, PTSwatches } = require('../Styling')
const { heading, subHeading, body, gradTile, bookCoverImage } = PTStyles
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

export default function CarouselItem({ item }) {
	const navigation = useNavigation();
	return (
		<Pressable onPress={() => navigation.navigate("AvailableListings", {listing: item})} style={styles.container}>
			{/* <LinearGradient
				colors={[PTGreen, PTBlue]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={gradTile}
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
			</LinearGradient> */}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "purple",
		borderColor: "white",
		borderWidth: 5,
		// flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// height: ,
		width: width,
	},
	headerBox: {
		...subHeading, 
		textAlign: "center", 
		width: width - 50, 
		fontWeight: "600", 
		overflow: "hidden",
	},
	image: {
		borderRadius: 20,
		height: ((width - 20)/3)*2,
		width: ((((width - 20)/3)*2)/3)*2,
		resizeMode: "cover",
	},
});
