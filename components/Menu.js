import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import HomeScreen from "./Home";
import WishList from "./WishList";
import UserLibrary from "./UserLibrary";
import SignOutScreen from "./SignOut";
import SwapHistory from "./SwapHistory";
import ActiveSwaps from "./ActiveSwaps";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { headerSS, importFonts, PTSwatches, PTStyles } = require("../Styling");
const { PTGreen, PTBlue, PTRed, PTG1, PTG2, PTG3, PTG4 } = PTSwatches;
const { heading, subHeading, body, page, roundButton } = PTStyles;
const { height, width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();

const BurgerIcon = ({ navigation }) => (
  <SimpleLineIcons
    name="menu"
    size={20}
    color={PTG1}
	style={{ left: height/54}}
    onPress={() => navigation.toggleDrawer()}
  />
);

function DrawerNavigator() {
  const [session, setSession] = useState(null);
  importFonts();
  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: (props) => <BurgerIcon navigation={navigation} />,
        ...headerSS,
        drawerStyle: {
          backgroundColor: "#272727",
        },
        drawerLabelStyle: {
          color: "white",
        },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={headerSS}
        initialParams={{ session: session }}
      />
      <Drawer.Screen name="Your Library" options={headerSS}>
        {(props) => <UserLibrary {...props} session={session} />}
      </Drawer.Screen>
      <Drawer.Screen name="Wishlist" options={headerSS}>
        {(props) => <WishList {...props} session={session} />}
      </Drawer.Screen>
      <Drawer.Screen name="Pending Swaps" options={headerSS}>
        {(props) => <ActiveSwaps {...props} session={session} />}
      </Drawer.Screen>
      <Drawer.Screen name="Swap History" options={headerSS}>
        {(props) => <SwapHistory {...props} session={session} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Sign Out"
        component={SignOutScreen}
        options={headerSS}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
