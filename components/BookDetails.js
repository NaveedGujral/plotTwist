import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import fetchBookData from './BookFetch';

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