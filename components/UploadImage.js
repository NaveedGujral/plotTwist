import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import supabase from "../config/supabaseClient";
import { Buffer } from "buffer";

window.Buffer = Buffer;

async function handleProfilePictureSelection(userId) {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled && result.assets[0].uri !== undefined) {
      let uri = result.assets[0].uri;
      let base64String = uri.split(",")[1];

      let binaryData = Buffer.from(base64String, "base64");

      let blob = new Blob([binaryData], { type: "image/jpeg" });

      let formData = new FormData();
      formData.append("file", blob, `${userId}.jpg`);

      // Get the session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("User is not authenticated");
        return;
      }

      console.log(
        "Supabase Storage Endpoint:",
        "https://rpnaooluhkwjcpwkzedr.supabase.co"
      );
      let response = await axios.post(
        `https://rpnaooluhkwjcpwkzedr.supabase.co/storage/v1/object/public/ProfilePictures/${userId}.jpg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      console.log("Response from upload:", response);

      if (response.status !== 200) {
        console.error("Error uploading file: ", response.statusText);
      } else {
        console.log("File uploaded successfully");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export default handleProfilePictureSelection;
