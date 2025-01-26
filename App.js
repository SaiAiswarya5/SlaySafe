import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, SafeAreaView, StatusBar, FlatList, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Safety tips and resources
const safetyTips = [
  {
    id: '1',
    title: 'Pepper Spray Maintenance',
    description: 'Replace your pepper spray every 2-3 years. Test it every 3 months by spraying a small amount outside.',
    icon: '🌶️'
  },
  {
    id: '2',
    title: 'Drink Safety',
    description: 'Use drink covers or special nail polish that changes color when exposed to common date rape drugs.',
    icon: '🍷'
  },
  {
    id: '3',
    title: 'Location Sharing',
    description: 'Share your live location with trusted friends when going out.',
    icon: '📍'
  },
  {
    id: '4',
    title: 'Emergency Contacts',
    description: 'Keep ICE (In Case of Emergency) contacts easily accessible.',
    icon: '📱'
  }
];

// Mock emergency resources (in real app, would be fetched based on location)
const emergencyResources = [
  {
    id: '1',
    name: 'Women\'s Safety Hotline',
    number: '1-800-SAFE-NOW',
    available: '24/7'
  },
  {
    id: '2',
    name: 'Local Police',
    number: '911',
    available: 'Emergency'
  },
  {
    id: '3',
    name: 'Safe Ride Service',
    number: '1-888-SAFE-RIDE',
    available: '9PM - 3AM'
  }
];

// Mock venue data
const mockVenues = [
  {
    id: '1',
    name: "Luna Lounge",
    type: "Bar & Lounge",
    address: "123 Main St",
    safetyRating: 4.8,
    features: ["Well-lit parking", "Security cameras", "Female security staff"],
    coordinates: { latitude: 37.78825, longitude: -122.4324 },
    reviews: [
      { id: '1', text: "Great atmosphere and attentive staff", rating: 5 },
      { id: '2', text: "Security is always present and professional", rating: 4.5 }
    ]
  },
  {
    id: '2',
    name: "The Pink Door",
    type: "Club & Dancing",
    address: "456 Oak Ave",
    safetyRating: 4.5,
    features: ["Drink testing kits", "Safe ride service", "All-female bartenders"],
    coordinates: { latitude: 37.78925, longitude: -122.4344 },
    reviews: [
      { id: '3', text: "Well-lit parking area, felt very safe", rating: 4.5 },
      { id: '4', text: "Friendly bouncers, zero tolerance for harassment", rating: 4.5 }
    ]
  },
  {
    id: '3',
    name: "Girls Night Party",
    type: "Special Event",
    address: "789 Pine St",
    safetyRating: 4.9,
    features: ["Women-only event", "Security escorts", "Bag check"],
    coordinates: { latitude: 37.79025, longitude: -122.4364 },
    reviews: [
      { id: '5', text: "Women-only event, great vibes!", rating: 5 },
      { id: '6', text: "Amazing organization and security", rating: 4.8 }
    ]
  }
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedTab, setSelectedTab] = useState('venues');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderVenues = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.coords?.latitude || 37.78825,
            longitude: location?.coords?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {mockVenues.map(venue => (
            <Marker
              key={venue.id}
              coordinate={venue.coordinates}
              title={venue.name}
              description={venue.type}
            />
          ))}
        </MapView>
      </View>
      <FlatList
        data={mockVenues}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.venueCard}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text style={styles.venueType}>{item.type}</Text>
            <Text style={styles.venueAddress}>{item.address}</Text>
            <Text style={styles.safetyRating}>Safety Rating: ⭐️ {item.safetyRating}/5</Text>
            <View style={styles.featuresList}>
              {item.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>• {feature}</Text>
              ))}
            </View>
            <View style={styles.reviewsList}>
              {item.reviews.map(review => (
                <View key={review.id} style={styles.review}>
                  <Text>{review.text}</Text>
                  <Text style={styles.rating}>Rating: {review.rating}/5 ⭐</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );

  const renderSafety = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💝 Safety Tips 💝</Text>
        {safetyTips.map(tip => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🆘 Emergency Resources 🆘</Text>
        {emergencyResources.map(resource => (
          <TouchableOpacity key={resource.id} style={styles.contactCard}>
            <Text style={styles.contactName}>{resource.name}</Text>
            <Text style={styles.contactNumber}>{resource.number}</Text>
            <Text style={styles.contactAvailable}>{resource.available}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>✨ SafeNightOut ✨</Text>
      </View>
      <View style={styles.content}>
        {selectedTab === 'venues' ? renderVenues() : renderSafety()}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'venues' && styles.activeTab]}
          onPress={() => setSelectedTab('venues')}
        >
          <Text style={[styles.tabText, selectedTab === 'venues' && styles.activeTabText]}>Venues</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'safety' && styles.activeTab]}
          onPress={() => setSelectedTab('safety')}
        >
          <Text style={[styles.tabText, selectedTab === 'safety' && styles.activeTabText]}>Safety</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  venueCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  venueType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  safetyRating: {
    fontSize: 16,
    color: '#ff69b4',
    marginBottom: 8,
  },
  featuresList: {
    marginTop: 8,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reviewsList: {
    marginTop: 16,
  },
  review: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff5f7',
    borderRadius: 8,
  },
  rating: {
    color: '#ff69b4',
    marginTop: 4,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ff69b4',
  },
  tipCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff5f7',
    borderRadius: 8,
  },
  tipIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
  },
  contactCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff3f7',
    borderRadius: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactNumber: {
    fontSize: 14,
    color: '#ff69b4',
    marginTop: 4,
  },
  contactAvailable: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#ff69b4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#ff69b4',
    fontWeight: 'bold',
  },
});
