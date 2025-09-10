import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import fishFarms from "../../data/fishfarms.json";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchSuppliers() {
  const [fish_value, fish_setValue] = useState(null);
  const [country_value, country_setValue] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const mapRef = useRef(null);

  const fish_data = [
    { label: "Salmon", value: "salmon" },
    { label: "Sea Bass", value: "sea_bass" },
    { label: "Mackerel", value: "mackerel" },
  ];

  const country_data = [
    { label: "England", value: "england", coords: { latitude: 52.3555, longitude: -1.1743 }, level: 30 },
    { label: "Scotland", value: "scotland", coords: { latitude: 56.4907, longitude: -4.2026 }, level: 20 },
    { label: "Wales", value: "wales", coords: { latitude: 52.1307, longitude: -3.7837 }, level: 20 },
    { label: "Northern Ireland", value: "northern_ireland", coords: { latitude: 54.7877, longitude: -6.4923 }, level: 20 },
    { label: "Norway", value: "norway", coords: { latitude: 60.472, longitude: 8.4689 }, level: 60 },
    { label: "France", value: "france", coords: { latitude: 46.603354, longitude: 1.888334 }, level: 40 },
    { label: "Germany", value: "germany", coords: { latitude: 51.1657, longitude: 10.4515 }, level: 40 },
    { label: "Spain", value: "spain", coords: { latitude: 40.4637, longitude: -3.7492 }, level: 40 },
    { label: "Italy", value: "italy", coords: { latitude: 41.8719, longitude: 12.5674 }, level: 40 },
    { label: "United States", value: "united_states", coords: { latitude: 37.0902, longitude: -95.7129 }, level: 50 },
    { label: "Canada", value: "canada", coords: { latitude: 56.1304, longitude: -106.3468 }, level: 50 },
    { label: "Australia", value: "australia", coords: { latitude: -25.2744, longitude: 133.7751 }, level: 50 },
    { label: "South Africa", value: "south_africa", coords: { latitude: -30.5595, longitude: 22.9375 }, level: 50 },
  ];
  

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [startRegion, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    })();
  }, []);

  const handleCountryChange = (country_item) => {
    country_setValue(country_item.value);

    const region = {
      latitude: country_item.coords.latitude,
      longitude: country_item.coords.longitude,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const getFillColor = (level) => {
    if (level > 60) return "rgba(255,0,0,0.4)";
    if (level > 40) return "rgba(255,165,0,0.4)";
    return "rgba(0,128,0,0.4)";
  };

  const countryMapping = {
    "united kingdom": "england", // Default to England for UK (could enhance with better logic)
    "england": "england",
    "scotland": "scotland",
    "wales": "wales",
    "northern ireland": "northern_ireland",
    "norway": "norway",
    "france": "france",
    "germany": "germany",
    "spain": "spain",
    "italy": "italy",
    "united states": "united_states",
    "canada": "canada",
    "australia": "australia",
  };

  const handleManualSearch = async () => {

    if (!manualLocation) return;

    try {
      // Geocode input location
      const geocodeResult = await Location.geocodeAsync(manualLocation);
      if (geocodeResult.length === 0) {
        Alert.alert("Location not found");
        return;
      }

      const { latitude, longitude } = geocodeResult[0];

      // Reverse geocode to get country info
      const reverseGeocodeResult = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocodeResult.length === 0) {
        Alert.alert("Could not identify country for this location");
        return;
      }

      const countryName = reverseGeocodeResult[0].country?.toLowerCase() || "";
      const mappedValue = countryMapping[countryName] || null;

      if (mappedValue) {
        const matchedCountry = country_data.find(c => c.value === mappedValue);
        if (matchedCountry) {
          country_setValue(matchedCountry.value);
          handleCountryChange(matchedCountry);
        }
      }

      // Animate map to location searched
      const region = {
        latitude,
        longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch (error) {
      Alert.alert("Error searching location");
      console.error(error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {startRegion.latitude !== 0 && (
        <MapView
          style={styles.map}
          initialRegion={startRegion}
          showsUserLocation={true}
          ref={mapRef}
        >
          {fish_value && country_value && fishFarms
            .filter((farm) =>
              farm.country.toLowerCase() === country_value.toLowerCase() &&
              farm.species.toLowerCase() === fish_value.replace('_', ' ').toLowerCase()
            )
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
      )}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          {/* <Text style={styles.explanation}>Select the fish and country or search manually</Text> */}

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter a location"
              value={manualLocation}
              onChangeText={setManualLocation}
              onSubmitEditing={handleManualSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleManualSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownRow}>
            <Dropdown
              style={[styles.dropdown, { marginRight: 8 }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={fish_data}
              labelField="label"
              valueField="value"
              placeholder="Select a fish"
              value={fish_value}
              onChange={(fish_item) => fish_setValue(fish_item.value)}
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
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 50,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  explanation: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  safeArea: {
    position: 'absolute',
    top: 0, // start at top of safe area
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center', // if you want to center inside safe area
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
