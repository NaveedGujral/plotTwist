import React from "react";
import { useState } from "react";
import { TextInput, View} from "react-native";
import BookDetails from "./BookFetch"
import BookTitleSearch from "./BookSearch";
import AuthorSearch from "./AuthorSearch";

const SearchBar = () => {

	const [titleSearch, setTitleSearch] = useState("")
	const [authorSearch, setAuthorSearch] = useState("")
	
	return (
		<View>
			{/* <BookDetails  bookId="7" /> */}
			<TextInput onChangeText={setTitleSearch} value={titleSearch} placeholder="search title here"/>
			<BookTitleSearch titleSearch={titleSearch} />
			<TextInput onChangeText={setAuthorSearch} value={authorSearch} placeholder="search author here" />
			{/* <TextInput onChangeText={setAuthorSearch} value={authorSearch} placeholder="search author here" /> */}
			<AuthorSearch authorSearch={authorSearch} />

		</View>
	);
};

export default SearchBar;