import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const BookDetails = ({book_Id}) => {
 const [bookData, setBookData] = useState(null);

 useEffect(() => {
 fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:7&format=json&jscmd=details`)
   .then((response) => response.json())
   .then((data) => setBookData(data[`ISBN:7`]))
   .catch((error) => console.error(error));
 }, []);
//  console.log(bookData.preview_url)


 if (!bookData) {
 return null; // or a loading spinner
 }

 return (
 <View>
   <Text>{bookData.details.title}</Text>
   {/* <Text>{bookData.authors && bookData.authors.map(author => author.name).join(', ')}</Text> */}
   <Text>{bookData.details.publish_date}</Text>
   {/* <Text>{bookData.description}</Text> */}
 </View>
 );
};

export default BookDetails;