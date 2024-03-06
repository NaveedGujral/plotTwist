import { useNavigation } from "@react-navigation/native";
import { React, useEffect, useState, useRef } from "react";

import {
  Dimensions,
  Platform,
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import supabase from "../config/supabaseClient";
import SwapCard from "./SwapCard";

import * as Animatable from "react-native-animatable";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("screen");
const pageHeight = height - (height / 27) * 4;
const renderHeaderHeight = 2*height/27;
const renderContentHeight = 8*pageHeight/9 - 3*renderHeaderHeight

const { PTStyles, PTSwatches, importFonts } = require("../Styling");
const { heading, subHeading, body, page, roundButton } = PTStyles;
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;

const ActiveSwaps = ({ session }) => {
  const navigation = useNavigation();
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState([]);

  const [sentSwaps, setSentSwaps] = useState([]);
  const [receivedSwaps, setReceivedSwaps] = useState([]);
  const [activeSwaps, setActiveSwaps] = useState([]);

  const [activeSections, setActiveSections] = useState([]);
  const content = [
    {
      title: "Incoming Requests",

      content: (
        <ScrollView
          style={{ height: renderContentHeight, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {receivedSwaps.length ? (
            receivedSwaps.map((swap) => {
              return (
                <SwapCard
                  swap={swap}
                  key={swap.pending_swap_id}
                  type={"received"}
                  session={session}
                  navigation={navigation}
                />
              );
            })
          ) : (
            <Text style={subHeading}>You have no new swap requests!</Text>
          )}
        </ScrollView>
      ),
    },
    {
      title: "Outgoing Requests",
      content: (
        <ScrollView
          style={{ height: renderContentHeight, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {sentSwaps.length ? (
            sentSwaps.map((swap) => (
              <SwapCard
                key={swap.pending_swap_id}
                swap={swap}
                type={"sent"}
                session={session}
                navigation={navigation}
              />
            ))
          ) : (
            <Text style={styles.antiText}>
              You have no sent swap requests pending!
            </Text>
          )}
        </ScrollView>
      ),
    },
    {
      title: "Pending Requests",
      content: (
        <ScrollView
          style={{ height: renderContentHeight, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {activeSwaps.length ? (
            activeSwaps.map((swap) => (
              <SwapCard
                swap={swap}
                key={swap.pending_swap_id}
                type={
                  swap.user1_id === userID ? "activeReceived" : "activeSent"
                }
                userID={userID}
                session={session}
                navigation={navigation}
              />
            ))
          ) : (
            <Text style={styles.antiText}>
              You have no active swap negotiations!
            </Text>
          )}
        </ScrollView>
      ),
    },
  ];

  const setSections = (sections) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[
          styles.header,
          { alignItems: "center", justifyContent: "space-between" },
          isActive ? styles.activeHeader : styles.inactiveHeader,
        ]}
        transition="backgroundColor"
      >
        <View
          style={{
            height: 2,
            width: "100%",
          }}
        ></View>
        <View
          style={{ width: width - (2 * width) / 27, justifyContent: "center" }}
        >
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={{ ...subHeading, alignSelf: "center" }}>
              {section.title}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              color={PTG1}
              style={{
                transform: isActive ? [{ rotate: "180deg" }] : [],
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: PTG4,
          }}
        ></View>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={styles.activeContent}
        transition="backgroundColor"
      >
        <Animatable.Text
          style={{ textAlign: "center" }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  useEffect(() => {
    if (session) {
      setUserID(session.user.id);
    }
  }, [session]);

  const getSwapInfo = async () => {
    const { data, error } = await supabase
      .from("Pending_Swaps")
      .select("*")
      .or(`user1_id.eq.${userID},user2_id.eq.${userID}`);
    setUserData(data);
    setSentSwaps(
      data.filter((swap) => swap.user1_id !== userID && !swap.user2_listing_id)
    );
    setReceivedSwaps(
      data.filter((swap) => swap.user1_id === userID && !swap.user2_listing_id)
    );
    setActiveSwaps(
      data.filter((swap) => swap.user1_listing_id && swap.user2_listing_id)
    );
  };

  useEffect(() => {
    if (userID) {
      getSwapInfo();
    }
  }, [userID]);

  return (
    <SafeAreaView style={page}>
      <View style={{ height: pageHeight }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              ...heading,
              textAlign: "center",
            }}
          >
            Pending Swaps
          </Text>
        </View>
        <View style={{ flex: 8 }}>
          <Accordion
            activeSections={activeSections}
            sections={content}
            touchableComponent={TouchableWithoutFeedback}
            expandMultiple={false}
            renderHeader={renderHeader}
            renderContent={renderContent}
            duration={500}
            onChange={setSections}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: renderHeaderHeight,
  },
  activeHeader: {
    backgroundColor: PTGreen,
  },
  inactiveHeader: {
    backgroundColor: PTG2,
  },
  activeContent: {
    backgroundColor: PTG4,
    height: renderContentHeight,
  },
  pageContainer: {
    backgroundColor: "#272727",
    width: width,
    flex: 1,
  },
  webFix: {
    marginBottom: height * 0.09,
  },
  title: {
    width: width * 0.9,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginVertical: 15,
    fontFamily: "JosefinSans_400Regular",
  },
  heading: {
    width: width * 0.9,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    marginBottom: 5,
    fontFamily: "JosefinSans_400Regular",
  },
  section: {
    marginVertical: 25,
  },
  hr: {
    width: width * 0.9,
    alignSelf: "center",
    borderBottomWidth: 1,
    borderColor: "white",
    marginBottom: 25,
  },
  antiText: {
    fontSize: 20,
    color: "white",
    fontFamily: "JosefinSans_400Regular",
    marginLeft: 20,
    marginTop: 20,
    fontWeight: "normal",
  },
});

export default ActiveSwaps;
