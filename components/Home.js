import { View, Text, Pressable, Dimensions, Platform, Image, Animated } from "react-native";
import { FadeIn, FadeOut } from    'react-native-reanimated';
import { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import {
	JosefinSans_400Regular,
} from "@expo-google-fonts/dev";

import BookList from "./BookList";
import TopTenCarousel from "./TopTenCarousel";

const { PTStyles, PTSwatches, importFonts } = require('../Styling')
const { heading, subHeading, body } = PTStyles
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches

const screenHeight = Dimensions.get('screen').height
const screenWidth = Dimensions.get('screen').width

const HomeScreen = ({ navigation }) => {
	const [categories, setCategories] = useState([]);
	const [currSession, setCurrSession] = useState();
	const [topTen, setTopTen] = useState([]);
	const scrollRef = useRef();
	const [scrollOffset, setScrollOffset] = useState(0);
	const scrollOffsetLimit = 200;

	importFonts()

	useEffect(() => {
		async function compareId(id) {
			const { data, error } = await supabase
				.from("Users")
				.select("*")
				.match({ user_id: id });
			return data;
		}
		async function getData() {
			const { data, error } = await supabase.auth.getSession();
			const { session } = data;
			setCurrSession(session.user.id);
			return session.user.id;
		}
		getData()
			.then((id) => {
				return compareId(id);
			})
			.then((data) => {
				if (data.length === 0) {
					navigation.navigate("UserProfile");
				}
			});
	}, []);

	useEffect(() => {
		async function getCategories() {
			const { data, error } = await supabase.from("Listings").select("Category");
			const catArr = [];
			data.forEach((obj) => {
				if (!catArr.includes(obj.Category)) catArr.push(obj.Category);
			});
			setCategories(catArr);
		}

		async function getTopTen(table) {
			const { data, error } = await supabase
				.from(table)
				.select()
				.order("no_of_wishlists", { ascending: false })
				.range(0, 9);
			setTopTen(data);
		}

		getTopTen("Listings");
		getCategories();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: PTG4}}>
			<View style={{ flex: 1}}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={scrollRef}
					onScroll={(event) => {
						setScrollOffset(event.nativeEvent.contentOffset.y);
					}}
					scrollEventThrottle={16}
				>
					<View
						style={
							Platform.OS === "web"
								? { ...styles.container, ...styles.webFix }
								: styles.container
						}
					>
						<Text style={{...heading, textAlign: "center", marginBottom: 10 }}>Spotlight</Text>
						<Text style={{...subHeading, paddingTop: screenHeight*0.01, paddingBottom: screenHeight*0.02}}>Top 10 Most Wishlisted</Text>
						<TopTenCarousel listings={topTen}/>
						<Text style={{...heading, textAlign: "center", marginBottom: 10 }}>Categories</Text>
						{categories.map((category) => {
							return (
								<BookList categoryName={category} key={category} id={currSession} />
							);
						})}
						<StatusBar style="auto" />
					</View>
				</ScrollView>
			</View>
				{scrollOffset > scrollOffsetLimit && (
					<Pressable
					style={
							styles.BTTContainer
						}
						onPress={() => {
							scrollRef.current?.scrollTo({
								y: 0,
								animated: true,
							});
						}}
					>
						<View style={styles.BTTCircle}>
							<MaterialCommunityIcons name="chevron-double-up" size={30} color={PTG1} style={styles.BTTArrow}/>
						</View>
					</Pressable>
				)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 20,
		backgroundColor: PTG4,
	},
	webFix: {
		marginBottom: screenHeight * 0.09,
	},
	BTTContainer: {
		position: "absolute",
		right: screenWidth * 0.5 - 25,
		top: screenHeight * 0.0125
	},
	BTTHeight: {
		bottom: 98,
	},
	BTTCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: PTGreen,
		shadowColor: PTG4,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.45,
		shadowRadius: 8,
		elevation: 16,
		justifyContent: "center",
		alignContent: "center",
	},
	BTTArrow: {
		textAlign: "center",
		width: "100%",
	},
});

export default HomeScreen;
