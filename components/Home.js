import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";
import BookDetails from "./Books";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>You're in the home screen!</Text>
      <Button
        title="sign out"
        onPress={() => {
          supabase.auth.signOut();
          navigation.navigate("Welcome");
        }}
      />
      <BookDetails />
    </View>
  );
};

export default HomeScreen;
