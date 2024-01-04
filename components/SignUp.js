import supabase from "../config/supabaseClient";
import { GoogleOAuth } from "./GoogleAuth";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Input } from "react-native-elements";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  async function signInWithGoogle() {
    console.log("hi")
    const { data, error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
    })
   console.log(data)
    if (error) {
     console.error('Error signing in with Google: ', error)
    } else {
     console.log('Signed in with Google: ', data)
    }
   }

  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setEmail("");
    setPassword("");

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    }
  }


  return (
    <View>
      <View>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
      </View>
      <View>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>
      <View>
        <Button title="Sign Up" onPress={() => signUpWithEmail()} />
        <Button
          title="Sign Up With Google"
          onPress={() => signInWithGoogle()}
        />
        {/* <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          // onPress={() => handleSignInWithGoogle()}
          disabled={false}
        /> */}
        {/* <GoogleOAuth /> */}
      </View>
    </View>
  );
}

// async function handleSignInWithGoogle() {
  //   try {
  //     // Get the Google ID token
  //     const { idToken } = await GoogleSignin.signIn();
   
  //     // Sign in with the Google ID token
  //     const { data, error } = await supabase.auth.signInWithIdToken({
  //       provider: 'google',
  //       token: idToken,
  //      //  nonce: 'NONCE', // must be the same one as provided in data-nonce (if any)
  //     });
   
  //     if (error) {
  //       console.error('Error signing in with Google: ', error);
  //     } else {
  //       console.log('Signed in with Google: ', data);
  //     }
  //   } catch (error) {
  //     console.error('Error getting Google ID token: ', error);
  //   }
  //  }


  // async function signUpWithGoogle() {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       queryParams: {
  //         access_type: "offline",
  //         prompt: "consent",
  //       },
  //     },
  //   });
  // }