import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import HomeScreen from './Home';
import WishList from './WishList';
import UserLibrary from './UserLibrary';
import SignOutScreen from './SignOut';
import SwapHistory from './SwapHistory';
import ActiveSwaps from './ActiveSwaps';
import { Image } from 'react-native-elements';
import { Text } from "react-native-elements";
import { useFonts } from "expo-font";
import {
	VollkornSC_400Regular,
	Bellefair_400Regular,
	CormorantGaramond_400Regular,
	JosefinSans_400Regular,
} from "@expo-google-fonts/dev";

const { headerSS } = require('../Styling')
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(session => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
    }, []);

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
		<Drawer.Navigator
			screenOptions={{
				...headerSS,
				drawerStyle: {
					backgroundColor: "#272727",
				},
				drawerLabelStyle: {
					color: "white",
				},
			}}
		>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={headerSS}
				initialParams={{ session: session }}
			/>
			<Drawer.Screen
				name="User Library"
				options={headerSS}
			>
				{(props) => <UserLibrary {...props} session={session} />}
			</Drawer.Screen>
			<Drawer.Screen
				name="Wishlist"
				options={headerSS}
			>
				{(props) => <WishList {...props} session={session} />}
			</Drawer.Screen>
            <Drawer.Screen
                name="Active Swaps"
                options={headerSS}
            >
                {props => (
                    <ActiveSwaps
                        {...props}
                        session={session}
                    />
                )}
            </Drawer.Screen>
			<Drawer.Screen
				name="Swap History"
				options={headerSS}
			>
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
