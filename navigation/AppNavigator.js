import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TicketsScreen from '../screens/TicketsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddEditEventScreen from '../screens/AddEditEventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  const { isAdmin } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="CalendarTab"
          component={CalendarScreen}
          options={{ title: 'Calendar', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesScreen}
          options={{ title: 'Favorites', tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="TicketsTab"
          component={TicketsScreen}
          options={{ title: 'Tickets', tabBarIcon: ({ color, size }) => <Ionicons name="ticket" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} /> }}
        />
      </Tab.Navigator>

      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddEditEvent')}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} options={{ title: 'Shto Event' }} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Detajet e Eventit' }} />
            <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Tiketa Jote' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabBarLabel: { fontSize: 10, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 78,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
