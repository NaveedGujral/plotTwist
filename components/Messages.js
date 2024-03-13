import { useEffect, useState } from "react";
import { Text, View, Pressable, StyleSheet, Dimensions, FlatList } from "react-native";
import supabase from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MessageItem from "./MessageItem";

const { PTStyles, PTSwatches } = require("../Styling");
const {
  heading,
  subHeading,
  body,
  page,
  pillButton,
  roundButton,
  roundButtonPressed,
  bookImage1,
} = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const userImageMap = {
  '2f71dabd-2f9c-48c3-8edd-4ae7495f59ce': require('../assets/ExampleUserProfilePictures/Alicia.jpg'),
  'c563d513-b021-42f2-a3b3-77067b8547af': require('../assets/ExampleUserProfilePictures/Jay.jpg'),
  'a4624164-bbbb-4cb6-b199-06b2fdd6f14a': require('../assets/ExampleUserProfilePictures/Jake.jpg'),
  '10240ee4-1b43-4749-afbe-1356c83af4da': require('../assets/ExampleUserProfilePictures/Nav.jpg'),
  'ce083d4c-a1e8-45d0-9f93-6bc092f7155b': require('../assets/ExampleUserProfilePictures/Ana.jpg'),
  'b45b3687-4e73-46e2-8474-da10e307691b': require('../assets/ExampleUserProfilePictures/Faith.jpg'),
};

function getChatKey(chat) {
  const ids = [chat.sender_id, chat.receiver_id].sort();
  return ids.join("-");
}
export default function ChatComponent({ navigation, route }) {
  const [chats, setChats] = useState([]);
  const [uniqueChats, setUniqueChats] = useState([]);
  const { session } = route.params;
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    fetchChats().then(setChats);
  }, []);

  async function fetchChats() {
    const { data, error } = await supabase
      .from("Chats")
      .select()
      .or(`sender_id.eq.${session.user.id}, receiver_id.eq.${session.user.id}`);

      console.log(data)
    return data;
  }

  const handlePostgresChanges = async () => {
    const length = chats.length;
    const res = await fetchChats(length);
    setChats(res);
  };

  supabase
    .channel("Chats")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Chats" },
      handlePostgresChanges
    )
    .subscribe();

  useEffect(() => {
    let uniqueData = chats.filter((chat, index, self) => {
      const key = getChatKey(chat);
      return !self
        .slice(0, index)
        .some((otherChat) => getChatKey(otherChat) === key);
    });

    setUniqueChats(uniqueData);
  }, [chats]);

  async function getUsername(chat) {
    let username = chat.sender_id;
    if (chat.sender_id === session.user.id) {
      username = chat.receiver_id;
    }
    const { data, error } = await supabase
      .from("Users")
      .select()
      .eq("user_id", username);
    return data;
  }

  useEffect(() => {
    Promise.all(
      uniqueChats.map(async (chat) => {
        const res = await getUsername(chat);
        if (Array.isArray(res) && res.length > 0) {
          setUsernames((prev) => [
            ...prev,
            [
              { sender: chat.sender_id },
              { receiver: chat.receiver_id },
              res[0].username,
            ],
          ]);
        }
      })
    );
  }, [uniqueChats]);

  // console.log(usernames)

  return (
    <View style={page}>
      <View
        style={{
          flex: 1,
          shadowOpacity: 1,
          shadowRadius: 8,
          shadowOffset: 8,
        }}
      >
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Messages
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <LinearGradient
            colors={[PTGreen, PTBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 5,
              width: "100%",
              zIndex: 1,
              elevation: 1,
            }}
          ></LinearGradient>
        </View>
      </View>

      <View style={{ backgroundColor: PTG4, flex: 9}}>

      <FlatList
          data={usernames}
          renderItem={({ item, index }) => (
            <MessageItem 
            usernames={item} 
            id={index}
            session={session}
            navigation={navigation} 
            />
          )}
          keyExtractor={(item) => item[2]}
          vertical={true}
          pagingEnabled
          snapToAlignment="center"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: "100%", alignSelf: "center" }}
          style={{ flex: 1 }}
        />

        {/* {usernames.map((username) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate("ChatWindow", {
                  sender: username[0].sender,
                  receiver: username[1].receiver,
                  username: username[2],
                  session: session,
                });
              }}
              key={username[2]}
              style={styles.listItem}
            >
              <Text style={styles.text} key={username[2]}>
                {username[2]}
              </Text>
            </Pressable>
          );
        })} */}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PTG4,
    flex: 1,
  },
  listItem: {
    borderBottomColor: PTG2,
    borderBottomWidth: 1,
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "left",
  },
});
