// // import React from 'react';
// // import { Button, Text } from 'react-native';
// // import { startAsync } from 'expo-auth-session';
// // import supabase from '../config/supabaseClient';
// // import { v4 as uuidv4 } from 'uuid';

// export const GoogleOAuth = () => {
// //  const onPress = async () => {
// //    const signInParams = {
// //      provider: 'google',
// //    };

// //    const { error } = await supabase.auth.signInWithOAuth(signInParams);
// //    if (error) {
// //      alert('Error happened: ' + error.message);
// //    }
// //  };

// //  return (
// //    <>
// //      <Button title="Sign in with Google" onPress={onPress} />
// //    </>
// //  );
// // };
// async function signInWithGoogle() {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//      provider: 'google',
//     })
   
//     if (error) {
//      console.error('Error signing in with Google: ', error)
//     } else {
//      console.log('Signed in with Google: ', data)
//     }
//    }
//    signInWithGoogle();
// }
   
