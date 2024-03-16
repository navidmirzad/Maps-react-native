import { app } from "./firebase";
import { Button, StyleSheet, View, Image } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
//import { useCollection } from "react-firebase-hooks/firestore";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      key: data.timeStamp,
      title: "Location",
      imagePath: "",
    };

    setMarkers([...markers, newMarker]);
  }

  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    getImage();
  }, []);

  async function uploadImage(locationId) {
    if (!imagePath) {
      console.log("No image to upload");
      return;
    }
    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const storageRef = ref(storage, `${locationId}_image.jpg`);
      await uploadBytes(storageRef, blob);
      setImagePath("");
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async function pickImage() {
    let imagePicked = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!imagePicked.canceled) {
      setImagePath(imagePicked.assets[0].uri);
    }
    uploadImage();
  }

  async function getImage() {
    try {
      getDownloadURL(ref(storage, `${locationId}_image.jpg`)).then((url) => {
        setImagePath(url);
        console.log("getImage successful");
      });
    } catch (error) {
      console.log("Couldn't get image from firebase " + error);
    }
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.key}
            title={marker.title}
            onPress={pickImage}
          />
        ))}
        <Image style={styles.image} source={{ uri: imagePath }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "150",
    height: "150",
    border: "2px solid black",
  },
});
