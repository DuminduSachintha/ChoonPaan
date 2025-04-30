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
import { getDatabase, ref, get, remove, set } from 'firebase/database';
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

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const snapshot = await get(ref(database, '/drivers'));
        const data = snapshot.val();
        if (data) {
          const driverList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setDrivers(driverList);
          setFilteredDrivers(driverList);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const filtered = drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [searchQuery, drivers]);

  const handleDelete = (id) => {
    Alert.alert('Delete Driver', 'Are you sure you want to delete this driver?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(ref(database, `/drivers/${id}`));
            setDrivers(drivers.filter((driver) => driver.id !== id));
          } catch (error) {
            console.error('Error deleting driver:', error);
          }
        },
      },
    ]);
  };

  const handleAddOrUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please enter both name and email.');
      return;
    }
    try {
      if (editingId) {
        await set(ref(database, `/drivers/${editingId}`), { name, email });
        setDrivers(
          drivers.map((driver) => (driver.id === editingId ? { id: editingId, name, email } : driver))
        );
        setEditingId(null);
      } else {
        const newId = Date.now().toString();
        await set(ref(database, `/drivers/${newId}`), { name, email });
        setDrivers([...drivers, { id: newId, name, email }]);
      }
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error saving driver:', error);
    }
  };

  const handleEdit = (driver) => {
    setName(driver.name);
    setEmail(driver.email);
    setEditingId(driver.id);
  };

  const generatePdfReport = async () => {
    const html = `
      <h1 style="text-align: center;">Driver Report</h1>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${filteredDrivers
            .map(
              (driver) => `
            <tr>
              <td>${driver.name}</td>
              <td>${driver.email}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const filePath = `${FileSystem.documentDirectory}DriverReport.pdf`;
      await FileSystem.copyAsync({ from: uri, to: filePath });
      Alert.alert('PDF Saved', 'The PDF has been saved to your device.');
      await Sharing.shareAsync(filePath, { mimeType: 'application/pdf', dialogTitle: 'Driver Report' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate the PDF.');
    }
  };

  return (
    <View style={styles.container}>
      {editingId === null ? (
        // Show "Add Driver" form
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <Button title="Add Driver" onPress={handleAddOrUpdate} />
        </>
      ) : (
        // Show "Update Driver" form
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <Button title="Update Driver" onPress={handleAddOrUpdate} />
        </>
      )}

      <TextInput style={styles.searchBar} placeholder="Search by name or email..." value={searchQuery} onChangeText={setSearchQuery} />
      
      <FlatList
        data={filteredDrivers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.driverItem}>
            <Text>{item.name} - {item.email}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Generate PDF Report" onPress={generatePdfReport} color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  searchBar: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20 },
  driverItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 10 },
  buttonRow: { flexDirection: 'row' },
  editButton: { marginRight: 10, backgroundColor: '#FFD700', padding: 5 },
  deleteButton: { backgroundColor: '#ff4444', padding: 5 },
});

export default ManageDrivers;
