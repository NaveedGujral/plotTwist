import {
  Bellefair_400Regular,
  CormorantGaramond_400Regular,
  JosefinSans_400Regular,
  VollkornSC_400Regular,
} from "@expo-google-fonts/dev";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button } from "react-native-elements";
import { StyleSheet } from "react-native-web";
import supabase from "../config/supabaseClient";

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  buttonText,
  pillButton,
  roundButton,
  roundButtonPressed,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { width, height } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const containerWidth = width - (2 * width) / 27;

const CreateListing = ({ route, navigation }) => {
  const { currTitle, authors, currDescription, imgUrl, book_id } = route.params;

  const [title, setTitle] = useState(currTitle);
  const [googleBookID, setGoogleBookID] = useState(book_id);
  const [author, setAuthor] = useState(authors);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState(currDescription);
  const [currImgUrl, setcurrImgUrl] = useState(imgUrl);

  const conditions = [
    { label: "New", value: "New" },
    { label: "Like New", value: "Like New" },
    { label: "Good", value: "Good" },
    { label: "Acceptable", value: "Acceptable" },
    { label: "Fair", value: "Fair" },
    { label: "Poor", value: "Poor" },
  ];

  const categories = [
    { label: "Fiction", value: "Fiction" },
    { label: "Mystery", value: "Mystery" },
    { label: "Romance", value: "Romance" },
    { label: "Sci-Fi", value: "Sci-Fi" },
    { label: "Fantasy", value: "Fantasy" },
    { label: "Horror", value: "Horror" },
    { label: "Thriller", value: "Thriller" },
    { label: "Historical Fiction", value: "Historical Fiction" },
    { label: "Non-Fiction", value: "Non-Fiction" },
    { label: "Biography", value: "Biography" },
    { label: "Autobiography", value: "Autobiography" },
    { label: "Philosophy", value: "Philosophy" },
    { label: "Science", value: "Science" },
    { label: "Travel", value: "Travel" },
    { label: "Poetry", value: "Poetry" },
    { label: "Drama", value: "Drama" },
    { label: "Comedy", value: "Comedy" },
    { label: "Children's", value: "Children's" },
    { label: "Young Adult", value: "Young Adult" },
  ];

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("Listings")
      .insert([
        {
          book_title: title,
          google_book_id: googleBookID,
          author: author,
          category: category,
          condition: condition,
          description: description,
          img_url: currImgUrl,
          no_of_wishlists: 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data: ", error);
      return;
    }
  };

  const [fontsLoaded] = useFonts({
    VollkornSC_400Regular,
    Bellefair_400Regular,
    CormorantGaramond_400Regular,
    JosefinSans_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ ...page, justifyContent: "center" }}>
      <View style={{ height: pageHeight / 9, justifyContent: "center" }}>
        <Text
          style={{
            ...heading,
            textAlign: "center",
          }}
        >
          Create Listing
        </Text>
      </View>
      <View style={{ alignItems: "center", width: width }}>
        <ScrollView
          contentContainerStyle={{ alignSelf: "center" }}
          style={styles.container}
        >
          <View style={styles.inputContainer}>
            <Text style={subHeading}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={setTitle}
              value={title}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={subHeading}>Author</Text>
            <TextInput
              style={styles.input}
              placeholder="Author"
              onChangeText={setAuthor}
              value={author}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={subHeading}>Genre</Text>
            <Dropdown
              data={categories}
              value={category}
              labelField="label"
              valueField="value"
              placeholder="Select Genre"
              style={{
                ...styles.input,
                paddingVertical: 0,
                height: (4 * pageHeight) / 81,
                zIndex: 1,
              }}
              placeholderStyle={{ ...subHeading, color: PTG4 }}
              itemTextStyle={{ ...subHeading, color: PTG4 }}
              selectedTextStyle={{ ...subHeading, color: PTG4 }}
              containerStyle={{
                ...styles.input,
                height: (33 * pageHeight) / 81,
                paddingVertical: 0,
              }}
              itemContainerStyle={{
                height: (4 * pageHeight) / 81,
                paddingHorizontal: 0,
                justifyContent: "center",
              }}
              activeColor={PTG1}
              onChange={(e) => {
                setCategory(e.value);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={subHeading}>Condition</Text>
            <Dropdown
              data={conditions}
              value={condition}
              labelField="label"
              valueField="value"
              placeholder="Select Condition"
              style={{
                ...styles.input,
                paddingVertical: 0,
                height: (4 * pageHeight) / 81,
                zIndex: 1,
              }}
              placeholderStyle={{ ...subHeading, color: PTG4 }}
              itemTextStyle={{ ...subHeading, color: PTG4 }}
              selectedTextStyle={{ ...subHeading, color: PTG4 }}
              containerStyle={{
                ...styles.input,
                height: (25 * pageHeight) / 81,
                paddingVertical: 0,
              }}
              showsVerticalScrollIndicator={false}
              itemContainerStyle={{
                height: (4 * pageHeight) / 81,
                paddingHorizontal: 0,
                justifyContent: "center",
              }}
              activeColor={PTG1}
              onChange={(e) => {
                setCondition(e.value);
              }}
            />
          </View>

          <View style={{ ...styles.inputContainer, height: pageHeight / 3 }}>
            <Text style={subHeading}>Description</Text>
            <TextInput
              style={{
                ...styles.input,
                height: (22 * pageHeight) / 81,
                borderRadius: (2 * pageHeight) / 81,
              }}
              placeholder="Enter description"
              onChangeText={setDescription}
              value={description}
              multiline
            />
          </View>

          <View
            style={{
              ...styles.inputContainer,
              alignItems: "center",
            }}
          >
            <Button
              buttonStyle={{ ...pillButton, width: width / 3 }}
              titleStyle={buttonText}
              title="Add Book"
              onPress={() => {
                handleSubmit();
                navigation.navigate("Home");
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: containerWidth,
    backgroundColor: "#272727",
    height: (8 * pageHeight) / 9,
  },

  inputContainer: {
    height: pageHeight / 9,
    justifyContent: "space-around",
  },

  label: {
    fontSize: 18,
    marginBottom: 5,
    color: "white",
    fontFamily: "JosefinSans_400Regular",
  },

  input: {
    ...subHeading,
    color: PTG4,
    height: (4 * pageHeight) / 81,
    width: containerWidth,
    borderRadius: (2 * pageHeight) / 81,
    padding: 15,
    backgroundColor: PTG1,
  },
  submitButton: {
    backgroundColor: "#06A77D",
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 20,
  },

  submitButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  formElementWithMargin: {
    marginTop: 200,
  },
});

export default CreateListing;
