import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

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
    reviews: [
      { id: '5', text: "Women-only event, great vibes!", rating: 5 },
      { id: '6', text: "Amazing organization and security", rating: 4.8 }
    ]
  }
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [venues, setVenues] = useState(mockVenues);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentTab, setCurrentTab] = useState('venues'); // ['venues', 'safety']

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

  const VenueItem = ({ venue }) => (
    <TouchableOpacity
      style={styles.venueItem}
      onPress={() => setSelectedVenue(venue)}
    >
      <View style={styles.venueHeader}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <View style={styles.safetyBadge}>
          <Text style={styles.safetyText}>
            Safety: {venue.safetyRating}/5 ✨
          </Text>
        </View>
      </View>
      <Text style={styles.venueType}>{venue.type}</Text>
      <Text style={styles.venueAddress}>{venue.address}</Text>
      <View style={styles.featureContainer}>
        {venue.features.map((feature, index) => (
          <Text key={index} style={styles.featureTag}>💗 {feature}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  const SafetyTipCard = ({ tip }) => (
    <View style={styles.tipCard}>
      <Text style={styles.tipIcon}>{tip.icon}</Text>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );

  const EmergencyResourceCard = ({ resource }) => (
    <View style={styles.resourceCard}>
      <Text style={styles.resourceName}>{resource.name}</Text>
      <Text style={styles.resourceNumber}>{resource.number}</Text>
      <Text style={styles.resourceAvailable}>{resource.available}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ SafeNightOut ✨</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'venues' && styles.activeTab]}
          onPress={() => setCurrentTab('venues')}
        >
          <Text style={[styles.tabText, currentTab === 'venues' && styles.activeTabText]}>Venues</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'safety' && styles.activeTab]}
          onPress={() => setCurrentTab('safety')}
        >
          <Text style={[styles.tabText, currentTab === 'safety' && styles.activeTabText]}>Safety</Text>
        </TouchableOpacity>
      </View>

      {currentTab === 'venues' ? (
        <>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
              />
            </MapView>
          )}

          <FlatList
            data={venues}
            renderItem={({ item }) => <VenueItem venue={item} />}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        </>
      ) : (
        <ScrollView style={styles.safetyContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>💝 Safety Tips 💝</Text>
            {safetyTips.map(tip => (
              <SafetyTipCard key={tip.id} tip={tip} />
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🆘 Emergency Resources 🆘</Text>
            {emergencyResources.map(resource => (
              <EmergencyResourceCard key={resource.id} resource={resource} />
            ))}
          </View>
        </ScrollView>
      )}

      {selectedVenue && (
        <View style={styles.venueDetails}>
          <Text style={styles.detailsTitle}>{selectedVenue.name}</Text>
          <Text style={styles.reviewsTitle}>Reviews:</Text>
          {selectedVenue.reviews.map(review => (
            <View key={review.id} style={styles.review}>
              <Text>{review.text}</Text>
              <Text style={styles.rating}>Rating: {review.rating}/5 ⭐</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedVenue(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f7',
  },
  header: {
    padding: 20,
    backgroundColor: '#ff69b4',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#ff1493',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#ff1493',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffd1dc',
    padding: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#ff69b4',
  },
  tabText: {
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  map: {
    height: 200,
  },
  list: {
    flex: 1,
  },
  venueItem: {
    padding: 15,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
    shadowColor: '#ff69b4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1493',
  },
  safetyBadge: {
    backgroundColor: '#ff69b4',
    padding: 8,
    borderRadius: 15,
  },
  safetyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  venueType: {
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  venueAddress: {
    color: '#999',
    marginTop: 2,
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  featureTag: {
    backgroundColor: '#ffd1dc',
    padding: 5,
    borderRadius: 10,
    margin: 2,
    fontSize: 12,
    color: '#ff1493',
  },
  safetyContainer: {
    flex: 1,
    padding: 15,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1493',
    textAlign: 'center',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#ff69b4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipIcon: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 5,
  },
  tipDescription: {
    color: '#666',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#ff69b4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 5,
  },
  resourceNumber: {
    fontSize: 18,
    color: '#ff69b4',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resourceAvailable: {
    color: '#666',
    fontStyle: 'italic',
  },
  venueDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#ff69b4',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 10,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginTop: 10,
  },
  review: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff5f7',
    borderRadius: 10,
  },
  rating: {
    color: '#ff69b4',
    marginTop: 5,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff69b4',
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
