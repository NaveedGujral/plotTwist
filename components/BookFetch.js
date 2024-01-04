import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import fetchBookData from './BookFetch';

const fetchBookData = async (bookId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookId}`);
      const json = await response.json();
      return json.items[0];
    } catch (error) {
      console.error(error);
    }
   };

   const BookDetails = ({ bookId }) => {
    const [bookData, setBookData] = useState(null);
    
    useEffect(() => {
        fetchBookData(bookId).then((data) => setBookData(data));
    }, [bookId]);
    
    if (!bookData) {
        return null; // or a loading spinner
    }
   
    return (
      <View>
        <Text>{bookData.volumeInfo.title}</Text>
        <Text>{bookData.volumeInfo.authors && bookData.volumeInfo.authors.join(', ')}</Text>
        <Text>{bookData.volumeInfo.publishedDate}</Text>
        <Text>{bookData.volumeInfo.description}</Text>
      </View>
    );
   };
   
   export default BookDetails;
   