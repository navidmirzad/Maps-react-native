import { StyleSheet, View, Image, Button } from "react-native";
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

  async function uploadImage() {
    if (!imagePath) {
      console.log("No image to upload");
      return;
    }

    const res = await fetch(imagePath);
    const blob = await res.blob();
    const storageRef = ref(storage, `image.jpg`);
    await uploadBytes(storageRef, blob).then((snapshot) => {
      alert("Image uploaded");
    });
  }

  useEffect(() => {
    getImage();
  }, []);

  async function getImage() {
    try {
      getDownloadURL(ref(storage, `image.jpg`)).then((url) => {
        setImagePath(url);
        console.log("getImage successful");
      });
    } catch (error) {
      console.log("Couldn't get image from firebase " + error);
    }
  }

  async function pickImage() {
    let imagePicked = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!imagePicked.canceled) {
      setImagePath(imagePicked.assets[0].uri);
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
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "10%",
  },
  map: {
    flex: 1,
    width: "98%",
    maxHeight: 600,
  },
  image: {
    alignSelf: "center",
    width: "35%",
    height: "25%",
    borderWidth: 2,
  },
});
