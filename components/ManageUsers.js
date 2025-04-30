import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const firebaseConfig = {
  apiKey: "AIzaSyBJOqCp0CnuS6b9u98gkKnyUbLXLTzSgP4",
  authDomain: "choon-paan-a632c.firebaseapp.com",
  projectId: "choon-paan-a632c",
  storageBucket: "choon-paan-a632c.appspot.com",
  messagingSenderId: "837744118873",
  appId: "1:837744118873:web:8c20b5fb51d70541d2f548",
  measurementId: "G-KKT0B0GW7J"
};

// Initialize Firebase and get database instance
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users from Firebase Realtime Database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(database, '/users'));
        const data = snapshot.val();
        if (data) {
          const userList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setUsers(userList);
          setFilteredUsers(userList);
        } else {
          console.log('No users found in the database.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Delete user with confirmation
  const deleteUser = (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(database, `/users/${userId}`));
              setUsers(users.filter((user) => user.id !== userId));
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          },
        },
      ]
    );
  };

  // Generate PDF report of all users and save it locally
  const generatePdfReport = async () => {
    const html = `
      <h1 style="text-align: center;">User Report</h1>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left;">Name</th>
            <th style="padding: 8px; text-align: left;">Email</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers
            .map(
              (user) => `
            <tr>
              <td style="padding: 8px;">${user.name}</td>
              <td style="padding: 8px;">${user.email}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    try {
      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Define a local file path
      const filePath = `${FileSystem.documentDirectory}UserReport.pdf`;

      // Copy file to the local storage
      await FileSystem.copyAsync({ from: uri, to: filePath });

      Alert.alert('PDF Saved', 'The PDF has been saved to your device.');

      // Share the PDF
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: 'User Report',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate the PDF.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteUser(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Generate PDF Report Button */}
      <View style={styles.reportButtonContainer}>
        <Button title="Generate PDF Report" onPress={generatePdfReport} color="#6200ee" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reportButtonContainer: {
    marginTop: 20,
  },
});

export default ManageUsers;
