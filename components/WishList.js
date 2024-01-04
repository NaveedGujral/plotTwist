import React from "react";
import { View} from "react-native";
import BookDetails from "./BookDetails";

const WishList = () => {
	return (
		<View>
			<BookDetails  bookId="7" />
			<BookDetails bookId="144" />
		</View>
	);
};

export default WishList;
