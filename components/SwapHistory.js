import { React, useCallback, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  Pressable,
} from "react-native";
import SwapCard from "./SwapCard";

const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { heading, subHeading, body, page, roundButton } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { height, width } = Dimensions.get("window");
const pageHeight = height - (height / 27) * 4;
const containerHeight = 8*pageHeight/9

const SwapHistory = ({ session }) => {
  const [userID, setUserID] = useState(session.user.id);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (session) {
      setUserID(session.user.id);
    }
  }, [session]);

  const getSwapInfo = async () => {
    const { data, error } = await supabase
      .from("Swap_History")
      .select("*")
      .or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
    setUserData(data);
    console.log(data)
  };

  useEffect(() => {
    if (userID) {
      getSwapInfo();
    }
  }, [userID]);

  const formatDate = (date) => {
    return date.split("T")[0];
  };

  return (
    <View style={page}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Swap History
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              height: 2,
              width: "100%",
              backgroundColor: PTG1,
            }}
          ></View>
        </View>
      </View>

      <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {userData.map((swap) => (
            <Pressable
              key={swap.pending_swap_id}
              style={styles.textContainer}
              onPress={() => {
                // Add navigation logic if needed
              }}
            >
              <View>
                <Text style={styles.textStyling}>
                  {`You swapped `}
                  <Text style={[styles.swapText]}>{swap.user1_book_title}</Text>
                  {` with `}
                  <Text style={[styles.swapText]}>{swap.user2_book_title}</Text>
                  {` on ${formatDate(swap.offer_date)}`}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView> */}
        <ScrollView
          style={{ height: containerHeight, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
            {userData.map((swap) => {
              return (
                <SwapCard
                  swap={swap}
                  key={swap.completed_swap_id}
                  type={"completed"}
                  session={session}
                  navigation={navigation}
                />
              );
            })
        }
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#272727",
    padding: 16,
  },
  headerText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  swapText: {
    fontFamily: "JosefinSans_400Regular",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  textContainer: {
    display: "flex",
    backgroundColor: "#06A77D",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 8,
    padding: 10,
  },
  textStyling: {
    color: "white",
    fontSize: 16,
    fontFamily: "JosefinSans_400Regular",
  },
});

export default SwapHistory;
