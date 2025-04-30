import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBJOqCp0CnuS6b9u98gkKnyUbLXLTzSgP4",
  authDomain: "choon-paan-a632c.firebaseapp.com",
  projectId: "choon-paan-a632c",
  storageBucket: "choon-paan-a632c.appspot.com",
  messagingSenderId: "837744118873",
  appId: "1:837744118873:web:8c20b5fb51d70541d2f548",
  measurementId: "G-KKT0B0GW7J"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const SetPriceScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [price, setPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);  // Track loading state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);  // Start loading
      try {
        const snapshot = await get(ref(database, '/users'));
        const data = snapshot.val();
        if (data) {
          const userList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setUsers(userList);
        } else {
          Alert.alert('No Users', 'No users found.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users.');
      } finally {
        setLoading(false);  // End loading
      }
    };
    fetchUsers();
  }, []);

  const handleViewPrice = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to view the price.');
      return;
    }
    try {
      setLoading(true);  // Start loading
      const snapshot = await get(ref(database, `/users/${selectedUser.id}/price`));
      if (snapshot.exists()) {
        setCurrentPrice(snapshot.val());
      } else {
        setCurrentPrice('Not Set');
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      Alert.alert('Error', 'Failed to fetch price.');
    } finally {
      setLoading(false);  // End loading
    }
  };

  const handleSetPrice = async () => {
    if (!selectedUser || price === '') {
      Alert.alert('Error', 'Please select a user and enter a price.');
      return;
    }
    try {
      setLoading(true);  // Start loading
      await update(ref(database, `/users/${selectedUser.id}`), { price });
      Alert.alert('Success', `Price set for ${selectedUser.name}: ${price}`);
      setPrice('');  // Clear price input
      setCurrentPrice(price);  // Update current price
    } catch (error) {
      console.error('Error updating price:', error);
      Alert.alert('Error', 'Failed to update price.');
    } finally {
      setLoading(false);  // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />  // Show loading indicator
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.userItem,
                selectedUser?.id === item.id && styles.selectedUser,
              ]}
              onPress={() => { setSelectedUser(item); setCurrentPrice(null); }}
            >
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedUser && (
        <View style={styles.inputContainer}>
          <Text>Set Price for: {selectedUser.name}</Text>
          {currentPrice !== null && <Text>Current Price: {currentPrice}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <Button title="View Price" onPress={handleViewPrice} color="blue" />
          <Button
            title="Set Price"
            onPress={handleSetPrice}
            color="#6200ee"
            disabled={!price}  // Disable button if price is empty
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  userItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedUser: {
    backgroundColor: '#cce5ff',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    marginBottom: 10,
  },
});

export default SetPriceScreen;
