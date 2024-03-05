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
const renderHeaderHeight = (6 * height) / 81;
const renderHeaderGap = height / 243;
const renderContentHeight = (9 * pageHeight) / 10 - 3 * renderHeaderHeight;
// const renderContentHeight =
//   (9 * pageHeight) / 10 - (3 * renderHeaderHeight + 2 * renderHeaderGap);

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

  function handleOnScroll(event) {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  }

  // experimental

  // Default active selector
  const [activeSections, setActiveSections] = useState([]);
  // Collapsed condition for the single collapsible
  const [collapsed, setCollapsed] = useState(true);
  // MultipleSelect is for the Multiple Expand allowed
  // True: Expand multiple at a time
  // False: One can be expand at a time
  // const [multipleSelect, setMultipleSelect] = useState(true);

  // const toggleExpanded = () => {
  //   // Toggling the state of single Collapsible
  //   setCollapsed(!collapsed);
  // };

  // Dummy content to show
  // You can also use dynamic data by calling web service
  // const content = [
  //   {
  //     title: "Incoming Requests",
  //     content:
  //       "The following terms and conditions, togethe with any referenced documents form a legal agreement between you and your employer, employees, agents, contractors and any other entity on whose behalf you accept these terms",
  //   },
  //   {
  //     title: "Outgoing Requests",
  //     content:
  //       "A Privacy Policy agreement is the agreement where you specify if you collect personal data from your users,  what kind of personal data you collect and what you do with that data.",
  //   },
  //   {
    //     title: "Pending Requests",
    //     content:
  //       "Our Return & Refund Policy template lets you get started with a Return and Refund Policy agreement. This template is free to download and use. According to TrueShip study, over 60% of customers review a Return/Refund Policy before they make a purchasing decision.",
  //   },
  // ];
  const content = [
    {
      title: "Incoming Requests",
      content: receivedSwaps.length ? (
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
        <Text style={styles.antiText}>You have no new swap requests!</Text>
      ),
    },
    {
      title: "Outgoing Requests",
      content: sentSwaps.length ? (
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
      ),
    },
    {
      title: "Pending Requests",
      content: activeSwaps.length ? (
        activeSwaps.map((swap) => (
          <SwapCard
            swap={swap}
            key={swap.pending_swap_id}
            type={swap.user1_id === userID ? "activeReceived" : "activeSent"}
            userID={userID}
            session={session}
            navigation={navigation}
          />
        ))
      ) : (
        <Text style={styles.antiText}>
          You have no active swap negotiations!
        </Text>
      ),
    },
  ];

  const setSections = (sections) => {
    // Setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    // Accordion header view
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
                // Rotate the icon by 180 degrees when isActive is true
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
    // Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={styles.activeContent}
        // style={[
        //   styles.content,
        //   isActive ? styles.active : styles.inactive
        // ]}
        transition="backgroundColor"
      >
        <Animatable.Text
          // animation={isActive ? 'bounceIn' : undefined}
          style={{ textAlign: "center" }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  // experimental

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
        <View style={{ flex: 9 }}>
          <Accordion
            activeSections={activeSections}
            // For any default active section
            sections={content}
            // Title and content of accordion
            touchableComponent={TouchableWithoutFeedback}
            // Which type of touchable component you want
            // It can be the following Touchables
            // TouchableHighlight, TouchableNativeFeedback
            // TouchableOpacity , TouchableWithoutFeedback
            expandMultiple={false}
            // If you want to expand multiple at a time
            renderHeader={renderHeader}
            // Header Component(View) to render
            renderContent={renderContent}
            // Content Component(View) to render
            duration={500}
            // Duration for Collapse and expand
            onChange={setSections}
            // Setting the state of active sections
          />
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <ScrollView
      style={
        Platform.OS === "ios"
          ? styles.pageContainer
          : { ...styles.pageContainer, ...styles.webFix }
      }
    >
      <Text style={styles.title}>Active Swaps</Text>
      <View style={styles.hr} />

      <View style={styles.section}>
        <Text style={styles.heading}>New Swap Requests</Text>
        {receivedSwaps.length ? (
          receivedSwaps.map((swap) => {
            return (
              <SwapCard
                swap={swap}
                type={"received"}
                session={session}
                navigation={navigation}
              />
            );
          })
        ) : (
          <Text style={styles.antiText}>You have no new swap requests!</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Active Swaps</Text>
        {activeSwaps.length ? (
          activeSwaps.map((swap) => (
            <SwapCard
              swap={swap}
              type={swap.user1_id === userID ? "activeReceived" : "activeSent"}
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
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Sent Swap Requests</Text>
        {sentSwaps.length ? (
          sentSwaps.map((swap) => (
            <SwapCard
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
      </View>
    </ScrollView>
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
    height: 200,
    // height: renderContentHeight,
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
