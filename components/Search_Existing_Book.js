import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Input,
  Dimensions,
  Pressable,
} from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { Searchbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import LibraryBookItem from "./LibraryBookItem";

const { height, width } = Dimensions.get("window");

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const pageHeight = height - (4 * height) / 27;
const containerWidth = width - (2 * width) / 27;
const listHeight = (46 * pageHeight) / 81;
const listCardHeight = listHeight / 2.5;
const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { heading, subHeading, body, page, roundButton, pillButton, buttonText } =
  PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;

const Search_Existing_Book = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [title, setTitle] = useState("");
  const [googleBookId, setGoogleBookId] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchType, setSearchType] = useState("title");

  // experimental
  const buttons = [
    {
      label: "Title",
      value: "title",
      labelStyle: {
        ...buttonText,
        color: searchType === "title" ? PTG1 : PTG4,
      },
    },
    {
      label: "Author",
      value: "author",
      labelStyle: {
        ...buttonText,
        color: searchType === "title" ? PTG4 : PTG1,
      },
    },
  ];
  const [segmentedButtonValue, setSegmentedButtonValue] = useState("title");

  const onValueChangeHandler = (value) => {
    setSegmentedButtonValue(value);
    setSearchType(value);
  };

  const styledButtons = buttons.map((button) => ({
    ...button,
    style: {
      borderWidth: 0,
      margin: 0,
      height: (4 * pageHeight) / 81,
      borderRadius: (2 * pageHeight) / 81,
      padding: 0,
      justifyContent: "center",
      alignItems: "center",
      // Additional styling for each button
    },
  }));
  // experimental

  let totalPages = Math.ceil(totalItems / 20);
  const api = process.env.GOOGLE_BOOKS_API_KEY;

  const handleSearch = async () => {
    let apiSearch;
    if (searchTerm !== "") {
      if (searchType === "title") {
        const apiSearchTitle = searchTerm.replace(/\s/g, "+");
        apiSearch = `https://www.googleapis.com/books/v1/volumes?q=${apiSearchTitle}&startIndex=${
          page * 20
        }&maxResults=20&key=${api}`;
      } else if (searchType === "author") {
        const apiSearchAuthor = searchTerm.replace(/\s/g, "+");
        apiSearch = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${apiSearchAuthor}&startIndex=${
          page * 20
        }&maxResults=20&key=${api}`;
      }
      try {
        const response = await fetch(apiSearch);
        const data = await response.json();
        if (data.items === undefined) {
          navigation.navigate("CreateListing");
        }
        if (data.totalItems <= page * 20 + 20) {
          setHasMore(false);
        }
        setTotalItems(data.totalItems);
        const filtered = data.items.filter(
          (book) => book.volumeInfo.language === "en"
        );
        setSearchResults(filtered);
        console.log("search books", data.items[0]);
        setHasSearched(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setGoogleBookId(book.id);
    setTitle(book.volumeInfo.title);
    setAuthors(book.volumeInfo.authors?.join(", ") || "");
    setDescription(book.volumeInfo.description);
    setImgUrl(
      book.volumeInfo.imageLinks.thumbnail
        ? book.volumeInfo.imageLinks.thumbnail
        : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg"
    );
  };

  useEffect(() => {
    if (title || authors) {
      navigation.navigate("CreateListing", {
        currTitle: title,
        authors: authors,
        currDescription: description,
        imgUrl: imgUrl,
        navigation: navigation,
        book_id: googleBookId,
      });
    }
  }, [title, authors]);

  return (
    <View
      style={{ ...PTStyles.page, height: pageHeight, alignItems: "center" }}
    >
      <View style={styles.headerContainer}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={heading}>Search Books</Text>
        </View>
        <View
          style={{
            flex: 2 / 3,
            justifyContent: "flex-start",
          }}
        >
          <SegmentedButtons
            style={{
              // gap: 15,
              padding: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: PTG1,
              height: (4 * pageHeight) / 81,
              borderRadius: (2 * pageHeight) / 81,
              width: (4 * width) / 9,
            }} // Styling for the component
            theme={{
              colors: {
                secondaryContainer: PTGreen,
                // onSecondaryContainer: PTG4,
              },
            }}
            value={segmentedButtonValue}
            onValueChange={onValueChangeHandler}
            buttons={styledButtons}
          />
        </View>
        <View style={{ flex: 2 / 3, justifyContent: "flex-start" }}>
          <Searchbar
            placeholder="Search for a book..."
            onChangeText={setSearchTerm}
            value={searchTerm}
            onSubmitEditing={handleSearch}
            style={{
              ...body,
              color: PTG4,
              justifyContent: "center",
              height: (4 * pageHeight) / 81,
              width: (6 * width) / 9,
              borderRadius: (2 * pageHeight) / 81,
              backgroundColor: PTG1,
            }}
            placeholderTextColor={PTG2}
            inputStyle={{
              ...body,
              height: "100%",
              alignSelf: "center",
              color: PTG4,
            }}
          />
        </View>
        <View
          style={{
            flex: 2 / 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Pressable
            title="Search"
            onPress={handleSearch}
            style={styles.button}
          >
            <Text
              style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}
            >
              Search
            </Text>
          </Pressable> */}

          <Pressable
            title="Add book manually"
            onPress={() => navigation.navigate("CreateListing")}
            style={{
              ...pillButton,
              backgroundColor: PTGreen,
              justifyContent: "center",
              width: (4 * width) / 9,
            }}
          >
            <Text style={buttonText}>Add book manually</Text>
          </Pressable>
          <LinearGradient
            colors={[PTGreen, PTBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 5,
              width: hasSearched && totalPages > 1 ? width : 0,
            }}
          ></LinearGradient>
        </View>
      </View>

      <View style={styles.flatlist}>
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectBook(item)}
              style={{
                height: listCardHeight,
                width: containerWidth,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: PTG4,
                }}
              ></View>
              <View
                style={{
                  height: listCardHeight - (2 * width) / 27,
                  width: "100%",
                  flexDirection: "row",
                  gap: width / 27,
                }}
              >
                <View
                  style={{
                    height: listCardHeight - (2 * width) / 27,
                    width: (2 * (listCardHeight - (2 * width) / 27)) / 3,
                  }}
                >
                  <Image
                    source={
                      item.volumeInfo.imageLinks !== undefined
                        ? { uri: item.volumeInfo.imageLinks.thumbnail }
                        : {
                            uri: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
                          }
                    }
                    style={styles.image}
                  />
                </View>
                <View
                  style={{
                    height: listCardHeight - (2 * width) / 27,
                    width:
                      containerWidth -
                      (2 * (listCardHeight - (2 * width) / 27)) / 3 -
                      width / 27,
                    // backgroundColor: PTRed
                  }}
                >
                  <Text style={subHeading}>{item.volumeInfo.title}</Text>
                  <Text style={subHeading}> </Text>
                  <Text style={subHeading}>{item.volumeInfo.authors}</Text>
                </View>
              </View>
              <View
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: PTG2,
                }}
              ></View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          vertical={true}
          pagingEnabled
          snapToAlignment="center"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: "100%", alignSelf: "center" }}
          style={{ flex: 1 }}
        />

        {/* <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatlistItems}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                alignItems: "center",
                backgroundColor: "rgba(169, 169, 169, 0.15)",
                padding: 16,
                width: Dimensions.get("window").width - 32,
                borderRadius: 30,
                overflow: "hidden",
                marginBottom: 25,
              }}
            >
              <Text style={styles.titleText}>{item.volumeInfo.title}</Text>
              <Text style={styles.authorText}>
                Written by{" "}
                {item.volumeInfo.authors && item.volumeInfo.authors.join(", ")}
              </Text>
              <Image
                source={
                  item.volumeInfo.imageLinks !== undefined
                    ? { uri: item.volumeInfo.imageLinks.thumbnail }
                    : {
                        uri: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
                      }
                }
                style={styles.image}
              />
              <Pressable
                onPress={() => handleSelectBook(item)}
                style={styles.selectButton}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "JosefinSans_400Regular",
                    fontSize: 18,
                    marginVertical: 10,
                  }}
                >
                  Select Book
                </Text>
              </Pressable>
            </LinearGradient>  
          )}
        /> */}
      </View>

      <View
        style={
          hasSearched && totalPages > 1
            ? styles.footerContainer
            : { ...styles.footerContainer, display: "none" }
        }
      >
        <LinearGradient
          colors={[PTGreen, PTBlue]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            height: 5,
            width: width,
          }}
        ></LinearGradient>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "space-between",
            width: containerWidth,
          }}
        >
          <Pressable
            onPress={() => setPage((prevPage) => prevPage + 1)}
            disabled={page === totalPages}
            style={{
              ...pillButton,
              backgroundColor: PTGreen,
              justifyContent: "center",
              width: (2 * width) / 9,
            }}
          >
            <Text style={buttonText}> Next </Text>
          </Pressable>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={subHeading}> Page: {page} </Text>
          </View>
          <Pressable
            onPress={() => setPage((prevPage) => prevPage - 1)}
            disabled={page === 1}
            style={{
              ...pillButton,
              backgroundColor: PTGreen,
              justifyContent: "center",
              width: (2 * width) / 9,
            }}
          >
            <Text style={buttonText}> Previous </Text>
          </Pressable>
        </View>
        <View style={{ height: 5, width: width }}></View>
      </View>
    </View>
  );
};

// return (
//   <View style={PTStyles.page}>

//     <FlatList
//       data={searchResults}
//       keyExtractor={(item) => item.id}
//       style={styles.flatlist}
//       contentContainerStyle={styles.flatlistItems}
//       ListHeaderComponent={
//         <View style={styles.headerContainer}>
//           <View>
//             <Text style={heading}>Find a Book</Text>
//           </View>
//           <Text style={styles.sortBy}>Sort by</Text>
//           <SegmentedButtons
//             value={searchType}
//             onValueChange={setSearchType}
//             buttons={[
//               { label: "Title", value: "title" },
//               { label: "Author", value: "author" },
//             ]}
//             style={{
//               width: "60%",
//             }}
//           />
//           <Searchbar
//             placeholder="Search for a book here..."
//             onChangeText={setSearchTerm}
//             value={searchTerm}
//             onSubmitEditing={handleSearch}
//             style={styles.searchbar}
//           />
//           <Pressable
//             title="Search"
//             onPress={handleSearch}
//             style={styles.button}
//           >
//             <Text
//               style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}
//             >
//               Search
//             </Text>
//           </Pressable>
//           <Pressable
//             title="Add book manually"
//             onPress={() => navigation.navigate("CreateListing")}
//             style={styles.button}
//           >
//             <Text
//               style={{ color: "white", fontFamily: "JosefinSans_400Regular" }}
//             >
//               Add book manually
//             </Text>
//           </Pressable>
//         </View>
//       }
//       ListFooterComponent={() => (
//         <View
//           style={
//             hasSearched && totalPages > 1
//               ? styles.footerContainer
//               : { ...styles.footerContainer, display: "none" }
//           }
//         >
//           <Pressable
//             onPress={() => setPage((prevPage) => prevPage - 1)}
//             disabled={page === 1}
//             style={styles.paginationButtons}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 fontFamily: "JosefinSans_400Regular",
//               }}
//             >
//               {" "}
//               Previous{" "}
//             </Text>
//           </Pressable>
//           <Text
//             style={{
//               color: "white",
//               fontFamily: "JosefinSans_400Regular",
//               fontSize: 13,
//             }}
//           >
//             {" "}
//             Page: {page}{" "}
//           </Text>
//           <Pressable
//             onPress={() => setPage((prevPage) => prevPage + 1)}
//             disabled={page === totalPages}
//             style={styles.paginationButtons}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 fontFamily: "JosefinSans_400Regular",
//               }}
//             >
//               {" "}
//               Next{" "}
//             </Text>
//           </Pressable>
//         </View>
//       )}
//       renderItem={({ item }) => (
//         <LinearGradient
//           colors={["#307361", "rgba(169, 169, 169, 0.10)"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={{
//             alignItems: "center",
//             backgroundColor: "rgba(169, 169, 169, 0.15)",
//             padding: 16,
//             width: Dimensions.get("window").width - 32,
//             borderRadius: 30,
//             overflow: "hidden",
//             marginBottom: 25,
//           }}
//         >
//           <Text style={styles.titleText}>{item.volumeInfo.title}</Text>
//           <Text style={styles.authorText}>
//             Written by{" "}
//             {item.volumeInfo.authors && item.volumeInfo.authors.join(", ")}
//           </Text>
//           <Image
//             source={
//               item.volumeInfo.imageLinks !== undefined
//                 ? { uri: item.volumeInfo.imageLinks.thumbnail }
//                 : {
//                     uri: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg",
//                   }
//             }
//             style={styles.image}
//           />
//           <Pressable
//             onPress={() => handleSelectBook(item)}
//             style={styles.selectButton}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 fontFamily: "JosefinSans_400Regular",
//                 fontSize: 18,
//                 marginVertical: 10,
//               }}
//             >
//               Select Book
//             </Text>
//           </Pressable>
//         </LinearGradient>
//       )}
//     />
//   </View>
// );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272727",
  },
  flatlistItems: {
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    marginTop: 20,
    marginBottom: 30,
  },
  sortBy: {
    textAlign: "left",
    fontFamily: "JosefinSans_400Regular",
    fontSize: 17,
    marginBottom: 10,
    color: "white",
  },
  searchbar: {
    width: (2 * width) / 3,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    fontFamily: "JosefinSans_400Regular",
    color: "white",
    // paddingTop: 10,
    // paddingBottom: 5,
  },
  authorText: {
    fontSize: 15,
    color: "white",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    // paddingBottom: 10,
    fontFamily: "JosefinSans_400Regular",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    marginTop: 7,
    marginBottom: 7,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 45,
  },
  paginationButtons: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 45,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: "#06A77D",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 45,
  },
  scrollview: {
    backgroundColor: "#272727",
  },
  flatlist: {
    height: listHeight,
  },
  footerContainer: {
    height: (8 * pageHeight) / 81,
    width: containerWidth,
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 20,
  },
  headerContainer: {
    height: (27 * pageHeight) / 81,
    width: screenWidth,
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 25,
  },
});

export default Search_Existing_Book;

// 27/81 of pageheight - header
// 2/3 - flex in header

// 1/3 of pageheight - header

// 1/9

// 2/27 of pageheight - footer
