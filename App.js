import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, SafeAreaView, StatusBar, FlatList, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';

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
    name: 'Purdue Safe Walk Program',
    number: '765-494-SAFE(7233)',
    available: '24/7'
  }
];

// Mock venue data
const mockVenues = [
  {
    id: '1',
    name: "Harry's Chocolate Shop",
    type: "Bar",
    address: "329 W State St, West Lafayette, IN 47906",
    safetyRating: 4,
    features: ["Well-lit environment", "Security cameras", "Reliable staff"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '1', text: "Great atmosphere and attentive staff", rating: 5 },
      { id: '2', text: "Security is always present and professional", rating: 4.5 }
    ]
  },
  {
    id: '2',
    name: "Neon Cactus",
    type: "Club & Dancing",
    address: "360 Brown St, West Lafayette, IN 47906",
    safetyRating: 3.7, 
    features: ["Spacious", "Loud music", "Girl's night friendly"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '3', text: "Well-lit parking area, but felt only moderately safe", rating: 3.5 },
      { id: '4', text: "Great security, fun place", rating: 3.9 }
    ]
  },
  {
    id: '3',
    name: "Girls Night Party",
    type: "Special Event",
    address: "789 Pine St",
    safetyRating: 4.9,
    features: ["Women-only event", "Security escorts", "Bag check"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '5', text: "Women-only event, great vibes!", rating: 5 },
      { id: '6', text: "Amazing organization and security", rating: 4.8 }
    ]
  }
];

// Mock events data
const mockEvents = [
  {
    id: '1',
    name: "Starry Night",
    type: "Music and Arts Festival",
    address: "Chauncey Square",
    safetyRating: 4,
    features: ["Busy environment", "Security patrol", "Small Buisnesses"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '1', text: "Great atmosphere and friendly vendors and volunteers", rating: 5 },
      { id: '2', text: "Beautiful environment and great food", rating: 4.5 }
    ]
  },
  {
    id: '2',
    name: "Bands Night at The Nest",
    type: "Live music & Dancing",
    address: "207 W Stadium Ave, West Lafayette, IN 47906",
    safetyRating: 4.5, 
    features: ["Party atmosphere", "Loud live music", "College bands"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '3', text: "Amazing performances by all the bands", rating: 4 },
      { id: '4', text: "Talented musicians and performers", rating: 4.2 }
    ]
  },
  {
    id: '3',
    name: "PSUB Bingo Night",
    type: "Student Union Club Event",
    address: "Purdue Memorial Union",
    safetyRating: 4.6,
    features: ["Community", "On campus", "Games"],
    coordinates: { latitude: 40.425869, longitude: -86.908066 },
    reviews: [
      { id: '5', text: "Safe, Exciting and fun", rating: 4 },
      { id: '6', text: "Love to be around friendly faces", rating: 4.8 }
    ]
  }
];

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedTab, setSelectedTab] = useState('venues');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Error fetching location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderVenues = () => (
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
      style={styles.venuesList}
      ListHeaderComponent={
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.coords?.latitude || 40.425869,
              longitude: location?.coords?.longitude || -86.908066,
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
      }
    />
  );

  const renderEvents = () => (
    <FlatList
      data={mockEvents}
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
      style={styles.venuesList}
    />
  );

  const renderSafety = () => (
    <ScrollView style={styles.safetyContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        {safetyTips.map(tip => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Resources</Text>
        {emergencyResources.map(resource => (
          <View key={resource.id} style={styles.resourceCard}>
            <Text style={styles.resourceName}>{resource.name}</Text>
            <Text style={styles.resourceNumber}>{resource.number}</Text>
            <Text style={styles.resourceAvailability}>Available: {resource.available}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>✨ Slay Safe ✨</Text>
      </View>
      <View style={styles.content}>
        {selectedTab === 'venues' ? renderVenues() : 
         selectedTab === 'events' ? renderEvents() : renderSafety()}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'venues' && styles.activeTab]}
          onPress={() => setSelectedTab('venues')}
        >
          <Text style={[styles.tabText, selectedTab === 'venues' && styles.activeTabText]}>Venues</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'events' && styles.activeTab]}
          onPress={() => setSelectedTab('events')}
        >
          <Text style={[styles.tabText, selectedTab === 'events' && styles.activeTabText]}>Events</Text>
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
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
    backgroundColor: '#c8b6ff',
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
    fontFamily: 'Georgia',
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
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  venueCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffb6c1',
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
    color: '#52022a',
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
    color: '#52022a',
    marginTop: 4,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#b3d1e7',
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
    color: '#52022a',
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
    color: '#52022a',
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
    borderTopColor: '#52022a',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#52022a',
    fontWeight: 'bold',
  },
  venuesList: {
    padding: 16,
  },
  eventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 24,
    color: '#52022a',
  },
  safetyContainer: {
    padding: 16,
  },
  resourceCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff5f7',
    borderRadius: 8,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resourceNumber: {
    fontSize: 14,
    color: '#52022a',
    marginTop: 4,
  },
  resourceAvailability: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
