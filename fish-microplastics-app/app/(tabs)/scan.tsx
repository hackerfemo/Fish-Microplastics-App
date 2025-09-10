import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { ScrollView } from 'react-native';

export default function MicroplasticRiskScreen() {
  const [permission, requestPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const cameraRef = useRef(null);

  // useEffect(() => {
  //   const getCameraPermissions = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     requestPermission(status === "granted");
  //   };

  //   getCameraPermissions();
  // }, []);

  const microplasticData = {
    "0123456789012": {
      productName: "Atlantic Salmon",
      regionName: "Norwegian Coast",
      riskLevel: "Moderate",
      notes: "Seasonal spike due to ocean currents near fjords.",
    },
    "1234567890123": {
      productName: "Pacific Tuna",
      regionName: "Western Pacific",
      riskLevel: "High",
      notes: "High microplastic concentration from nearby plastic gyres.",
    },
    "2345678901234": {
      productName: "Indian Mackerel",
      regionName: "Bay of Bengal",
      riskLevel: "Low",
      notes: "Region currently shows minimal plastic concentration.",
    },
  };

  const handleBarCodeScanned = ({ type, data }) => {
    // setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    setTimeout(() => {
      const result = microplasticData[data];
      if (!result) {
        Alert.alert('Product Not Found', `No data for barcode: ${data}`);
        setRiskData(null);
      } else {
        setRiskData(result);
      }
      setLoading(false);
    }, 800);
  };

  const resetScanner = () => {
    setScanned(false);
    setRiskData(null);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return '#e74c3c';
      case 'Moderate': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#007AFF';
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera View - show when not scanned */}
      {!scanned && (
        // @ts-ignore: barcodeScannerEnabled is not typed yet
        <CameraView
          ref={cameraRef}
          barcodeScannerEnabled={true}
          onBarcodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
  
      {/* Loading indicator */}
      {/* {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )} */}
  
      {/* Risk Result UI - scrollable */}
      {!loading && scanned && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {riskData && (
            <View
              style={[
                styles.resultBox,
                { borderLeftColor: getRiskColor(riskData?.riskLevel) },
              ]}
            >
              <Text style={styles.resultTitle}>Microplastic Contamination Risk</Text>
              <Text style={styles.resultText}>Product: {riskData.productName}</Text>
              <Text style={styles.resultText}>Region: {riskData.regionName}</Text>
              <Text style={styles.resultText}>Risk Level: {riskData.riskLevel}</Text>
              <Text style={styles.resultNote}>{riskData.notes}</Text>
            </View>
          )}
  
          <View style={styles.buttonCard}>
            <Button title="Scan Another" onPress={resetScanner} />
          </View>
        </ScrollView>
      )}
  
      {/* Fallback for scanned but no result */}
      {/* {!loading && !riskData && scanned && (
        <View style={styles.overlay}>
          <Button title="Tap to Scan Again" onPress={resetScanner} />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f5' },
  message: { textAlign: 'center', paddingBottom: 10 },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  resultBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF',
    marginBottom: 20, // Add spacing before the button
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },

  resultText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },

  resultNote: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#666',
    fontSize: 14,
  },
  scrollContainer: {
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  buttonCard: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    borderLeftColor: '#007AFF'
  },
});
