import { StyleSheet, View, Image, Button, Text } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { useCollection } from "react-firebase-hooks/firestore";
import { database, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function App() {
  const [values, loading, error] = useCollection(collection(database, "maps"));
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  // Retrieves markers and data about them
  useEffect(() => {
    if (!loading && values) {
      const retrievedMarkers = values.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        imagePath: null, // Initialize imagePath for each marker
      }));
      setMarkers(retrievedMarkers);
    }
  }, [loading, values]);

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      title: "Location",
      imagePath: null, // Initialize imagePath for the new marker
    };
    try {
      const docRef = await addDoc(collection(database, "maps"), newMarker);
      setMarkers([...markers, { ...newMarker, id: docRef.id }]);
    } catch (error) {
      console.log("Error adding to Firebase: " + error);
    }
  }

  async function pickImage(markerId) {
    let imagePicked = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!imagePicked.cancelled) {
      const imagePath = imagePicked.assets[0].uri;
      await uploadImage(markerId, imagePath);
    }
  }

  async function uploadImage(markerId, imagePath) {
    if (!imagePath) {
      console.log("No image to upload");
      return;
    }

    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const storageRef = ref(storage, `${markerId}image.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
      // Update the marker's imagePath in both local state and Firestore database
      setMarkers(
        markers.map((marker) =>
          marker.id === markerId
            ? { ...marker, imagePath: downloadURL }
            : marker
        )
      );
      // Update the imagePath in Firestore document
      await updateDoc(doc(database, "maps", markerId), {
        imagePath: downloadURL,
      });
    } catch (error) {
      console.log("Error uploading image :" + error);
    }
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker
            coordinate={marker.coordinate}
            key={marker.id}
            title={marker.title}
            onPress={() => pickImage(marker.id)} // Pass the markerId to pickImage
          >
            {marker.imagePath && (
              <Callout style={styles.callout}>
                <Image
                  key={marker.id}
                  style={styles.image}
                  source={{ uri: marker.imagePath }}
                />
                <Text>{marker.title}</Text>
              </Callout>
            )}
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  map: {
    flex: 1,
    width: "98%",
    maxHeight: 600,
  },
  callout: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
