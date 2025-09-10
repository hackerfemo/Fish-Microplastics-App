import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

// Sample product names to pick randomly
const products = [
  "Atlantic Salmon",
  "Pacific Tuna",
  "Indian Mackerel",
  "Sea Bass",
  "Yellowfin Tuna",
];

const infoCards = [
  {
    title: '🌊 Microplastic Data',
    content:
      'We use ocean datasets on microplastic pollution to identify regions with higher contamination risk.',
  },
  {
    title: '🐟 Fish Species',
    content:
      'Choose species like salmon, sea bass, or mackerel to see how they may accumulate plastics in their environments.',
  },
  {
    title: '🗺️ Interactive Map',
    content:
      'Explore fish farms and catch areas on a map overlaid with pollution data to understand regional risks.',
  },
  {
    title: '📱 Product Scanner',
    content:
      'Soon you’ll be able to scan the barcode of packaged fish from the supermarket and instantly see estimated microplastic contamination levels based on its origin.',
    note: 'Work in progress – stay tuned!',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [randomProduct, setRandomProduct] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  useEffect(() => {
    const pickRandom = products[Math.floor(Math.random() * products.length)];
    setRandomProduct(pickRandom);
  }, []);

  const toggleCard = (index) => {
    setActiveCardIndex(activeCardIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/images/logo.png' )} // Replace with your logo url or local asset
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.topBarText}>PureFish</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push('/scan')}
            style={styles.actionButton}
            icon="barcode-scan"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Scan a Product
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/search')}
            style={styles.actionButton}
            icon="magnify"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Search Suppliers
          </Button>
        </View>

        {/* Info Cards */}
        {infoCards.map((card, i) => (
          <Card key={i} style={styles.card}>
            <TouchableOpacity onPress={() => toggleCard(i)}>
              <Card.Title
                title={card.title}
                right={props => (
                  <IconButton
                    {...props}
                    icon={activeCardIndex === i ? 'chevron-up' : 'chevron-down'}
                  />
                )}
              />
            </TouchableOpacity>

            <Collapsible collapsed={activeCardIndex !== i}>
              <Card.Content>
                <Text style={styles.cardContent}>{card.content}</Text>
                {card.note && (
                  <Text style={styles.cardNote}>{card.note}</Text>
                )}
              </Card.Content>
            </Collapsible>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
  },
  
topBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#3778bd',
  paddingVertical: 16,
  paddingHorizontal: 16,
  paddingTop: Constants.statusBarHeight + 16, 
  justifyContent: 'center',
},
  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  topBarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  cardNote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
  },
});
