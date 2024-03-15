import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import supabase from "../config/supabaseClient";
import { LinearGradient } from "expo-linear-gradient";

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
// const headerHeight = (2 * (pageHeight - height / 27)) / 9;
const headerHeight = (4 * height) / 27;
const containerWidth = width - (2 * width) / 27;

export default function ChatWindow({ route }) {
  const { sender, receiver, username, session, profilePicture } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");

  async function fetchChats() {
    const { data, error } = await supabase
      .from("Chats")
      .select()
      .in("sender_id", [sender, receiver])
      .in("receiver_id", [sender, receiver]);

    return data;
  }

  useEffect(() => {
    fetchChats().then(setChatMessages);
  }, []);

  const handlePostgresChanges = async () => {
    const res = await fetchChats();
    setChatMessages(res);
  };

  async function sendMessage() {
    let sendData = {
      sender_id: receiver,
      receiver_id: sender,
      message: text,
    };

    if (sender === session.user.id) {
      sendData = { sender_id: sender, receiver_id: receiver, message: text };
    }
    const { data, error } = await supabase.from("Chats").insert([sendData]);
    setText("");
  }

  supabase
    .channel("Chats")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Chats" },
      handlePostgresChanges
    )
    .subscribe();

  const scrollViewRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 500);
  }, [chatMessages]);

  return (
    <View style={styles.container}>
      <View
        style={{
          // flex: 2,
          height: headerHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: headerHeight - 5,
            width: containerWidth,
            flexDirection: "row",
            alignItems: "center",
            gap: width / 27,
          }}
        >
          <View>
            <Image source={profilePicture} style={styles.profilePicture} />
          </View>
          <View>
            <Text style={heading}>{username}</Text>
          </View>
        </View>
        <View style={{ height: 5, justifyContent: "flex-end" }}>
          <LinearGradient
            colors={[PTGreen, PTBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: "100%",
              width: width,
              zIndex: 1,
              elevation: 1,
            }}
          ></LinearGradient>
        </View>
      </View>

      <View
        style={{
          // flex: 7
          height: pageHeight - (6 * height) / 27,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{
            width: width - (2 * width) / 27,
          }}
          contentContainerStyle={
            {
              // flexGrow: 1
            }
          }
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((message) => {
            if (!message) {
              console.warn("Encountered undefined message object");
              return null;
            }
            return message.sender_id === session.user.id ? (
              <View
                style={
                  chatMessages[0] === message
                    ? {
                        ...styles.message,
                        alignSelf: "flex-end",
                        color: PTG1,
                        backgroundColor: PTBlue,
                        marginTop: (2 * width) / 81,
                      }
                    : {
                        ...styles.message,
                        alignSelf: "flex-end",
                        color: PTG1,
                        backgroundColor: PTBlue,
                      }
                }
              >
                <Text style={body}>{message.message}</Text>
                {/* {session.user.user_metadata.username}: {message.message} */}
              </View>
            ) : (
              <View
                style={
                  chatMessages[0] === message
                    ? {
                        ...styles.message,
                        alignSelf: "flex-start",
                        color: PTG4,
                        backgroundColor: PTG1,
                        marginTop: (2 * width) / 81,
                      }
                    : {
                        ...styles.message,
                        alignSelf: "flex-start",
                        color: PTG4,
                        backgroundColor: PTG1,
                      }
                }
              >
                {/* {username}: {message.message} */}
                <Text>{message.message}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ height: (2 * height) / 27 }}>
        {Platform.OS !== "web" && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Send a message ..."
                onChangeText={setText}
                value={text}
                onSubmitEditing={sendMessage}
                style={{
                  ...body,
                  height: "100%",
                  paddingHorizontal: 10,
                  backgroundColor: PTG3,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        )}
        {Platform.OS === "web" && (
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Send a message ..."
                onChangeText={setText}
                value={text}
                onSubmitEditing={sendMessage}
                style={{
                  ...body,
                  height: "100%",
                  paddingHorizontal: 10,
                  backgroundColor: PTG3,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: pageHeight,
    backgroundColor: PTG4,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  profilePicture: {
    height: (7 * headerHeight) / 9,
    width: (7 * headerHeight) / 9,
    borderRadius: (7 * headerHeight) / 18,
  },
  inputContainer: {
    backgroundColor: PTG1,
    width: width,
    height: "100%",
  },
  footer: {
    width: width,
    height: "100%",
  },
  message: {
    padding: (2 * width) / 81,
    borderRadius: (2 * pageHeight) / 81,
    marginBottom: (2 * width) / 81,
    minHeight: (4 * pageHeight) / 81,
    maxWidth: (2 * (width - (2 * width) / 27)) / 3,
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "100",
    color: PTSwatches.PTG3,
    fontFamily: "JosefinSans_",
    height: "100%",
    paddingHorizontal: 10,
  },
});
