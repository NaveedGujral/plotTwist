const fetchBookData = async (bookId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookId}`);
      const json = await response.json();
      return json.items[0];
    } catch (error) {
      console.error(error);
    }
   };

export default fetchBookData;
   