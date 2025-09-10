import * as React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header Image */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80' }}
        // Healthy fish underwater, calm ocean scene
        style={styles.headerImage}
      />

      {/* Intro */}
      <View style={styles.intro}>
        <Text variant="titleMedium" style={styles.title}>Microplastic Risk in Fish</Text>
        <Text variant="bodyMedium" style={styles.paragraph}>
          This app combines global ocean microplastic data with fish catch locations
          to estimate the risk of plastic contamination in seafood.
          Select a fish and its source region to explore contamination risks.
        </Text>
      </View>

      {/* Cards */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">🌊 Microplastic Data</Text>
          <Text variant="bodyMedium">
            We use ocean datasets on microplastic pollution to identify regions
            with higher contamination risk.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">🐟 Fish Species</Text>
          <Text variant="bodyMedium">
            Choose species like salmon, sea bass, or mackerel to see how they
            may accumulate plastics in their environments.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">🗺️ Interactive Map</Text>
          <Text variant="bodyMedium">
            Explore fish farms and catch areas on a map overlaid with
            pollution data to understand regional risks.
          </Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">📱 Product Scanner (Coming Soon)</Text>
          <Text variant="bodyMedium">
            Soon you’ll be able to scan the barcode of packaged fish from the supermarket
            and instantly see estimated microplastic contamination levels based on its origin.
          </Text>
          <Text variant="bodySmall" style={{ fontStyle: 'italic', color: '#888', marginTop: 4 }}>
            Work in progress – stay tuned!
          </Text>
        </Card.Content>
      </Card>


      {/* CTA */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  intro: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  card: {
    margin: 12,
    borderRadius: 12,
    elevation: 3,
  },
  button: {
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
});
