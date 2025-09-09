import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Circle } from 'react-native-maps';
import fishFarms from "../../data/fishfarms.json";


export default function App() {
  const [fish_value, fish_setValue] = useState(null);
  const [country_value, country_setValue] = useState(null);
  const mapRef = useRef(null);

  const fish_data = [
    { label: "Salmon", value: "salmon" },
    { label: "Sea Bass", value: "sea_bass" },
    { label: "Mackerel", value: "mackerel" },
  ];

  const country_data = [
    { label: "England", value: "england", coords: { latitude: 52.3555, longitude: -1.1743 }, level: 30 },
    { label: "Norway", value: "norway", coords: { latitude: 60.472, longitude: 8.4689 }, level: 60 },
    { label: "Scotland", value: "scotland", coords: { latitude: 56.4907, longitude: -4.2026 }, level: 20 },
  ]

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleCountryChange = (country_item) => {
    country_setValue(country_item.value);

    const region = {
      latitude: country_item.coords.latitude,
      longitude: country_item.coords.longitude,
      latitudeDelta: 10,  // zoom level (smaller = more zoomed in)
      longitudeDelta: 10,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000); // animate over 1s
    }
  };

  const getFillColor = (level) => {
    if (level > 60) return "rgba(255,0,0,0.4)"; // red
    if (level > 40) return "rgba(255,165,0,0.4)"; // orange
    return "rgba(0,128,0,0.4)"; // green
  };

  return (

    <View style={{ flexDirection: 'column', flex: 1 }}>
      <View style={styles.container}>
        {/* Dropdown at the top */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={fish_data}
          labelField="label"
          valueField="value"
          placeholder="Select a fish"
          value={fish_value}
          onChange={(fish_item) => {
            fish_setValue(fish_item.value);
          }}
        />

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={country_data}
          labelField="label"
          valueField="value"
          placeholder="Select a country"
          value={country_value}
          onChange={(country_item) => {
            country_setValue(country_item.value);
            handleCountryChange(country_item);
          }}
        />

      </View>
      <View>
        <MapView style={styles.map} showsUserLocation={true} ref={mapRef}>
          {fishFarms
            .filter((farm) => {
              const matchesCountry = !country_value || farm.country.toLowerCase() === country_value.toLowerCase();
              const matchesFish = !fish_value || farm.species.toLowerCase() === fish_value.replace('_', ' ').toLowerCase();
              return matchesCountry && matchesFish;
            })
            .map((farm) => (
              <Circle
                key={farm.id}
                center={{ latitude: farm.latitude, longitude: farm.longitude }}
                radius={farm.level * 1000}
                fillColor={getFillColor(farm.level)}
                strokeColor="rgba(0,0,0,0.2)"
              />
            ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // keeps dropdown at top
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: 'row',
  },
  dropdown: {
    height: 50,
    width: '50%',
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  selectionText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: '100%',
    height: '100%',
  },
});