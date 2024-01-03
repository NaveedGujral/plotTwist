import { View, Text } from "react-native";
import { useEffect } from "react";
import { Button } from "react-native-elements";
import supabase from "../config/supabaseClient";

import CarouselComponent from "./CarouselComponent";

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    async function compareId(id) {
    const { data, error } = await supabase
    .from('Users')
    .select('*')
    .match({ user_id: id,}) 
    return data
    }
    async function getData() {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;
      return session.user.id
    }
    getData()
    .then(async(id) => {
      const {data} = await compareId(id)
      if(!data){
        // navigation.navigate("UserProfile")
        console.log('hello')
      }
    })
  }, []);


  // return (
  //   <View>
  //     <Text>You're in the home screen!</Text>
  //     <Button
  //       title="sign out"
  //       onPress={() => {
  //         supabase.auth.signOut();
  //         navigation.navigate("Welcome");
  //       }}
  //     />
  //   </View>
  // );

  return (
    <View>
      <CarouselComponent />
    </View>
  )
};

export default HomeScreen;
