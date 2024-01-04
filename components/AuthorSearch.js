import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';

const queryBooks = async (authorSearch) => {
    
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${authorSearch}&key=AIzaSyBMR5p0dW3LjnGfX74FAk5GGeB2veYACIk`);
        const json = await response.json();
        return json.items;
    } catch (error) {
        console.error(error);
    }
    
};

const AuthorSearch = ({authorSearch}) => {
    // const [authorSearch, setAuthorSearch] = useState("")
    const [bookData, setBookData] = useState(null);
    
    useEffect(() => {
        queryBooks(authorSearch).then((data) => 
        setBookData(data)
        );
    }, [authorSearch]);
    
    if (!bookData) {
        return null; // or a loading spinner
    }

    return (
      <View>
        {bookData.map((book) => 
        <View>
           <Text>{book.volumeInfo.title}</Text>
           <Text>WRITTEN BY: {book.volumeInfo.authors && book.volumeInfo.authors.join(', ')}</Text>
            <Text>PUBLISHED: {book.volumeInfo.publishedDate}</Text>
            <Text>ABOUT: {book.volumeInfo.description}</Text>
            {/* {book.volumeInfo.imageLinks.smallThumbnail? <Image source={{uri: book.volumeInfo.imageLinks.thumbnail}} style={{width: 100, height: 100}}/> : <Text> No image available </Text>} */}
        </View>
        )}
      </View>
    )
};

export default AuthorSearch
