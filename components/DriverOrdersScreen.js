import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity
} from 'react-native';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

const DriverOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({});
  const [errors, setErrors] = useState({});
  const [price, setPrice] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders/');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrders(Object.entries(data).map(([id, order]) => ({ id, ...order })));
      } else {
        setOrders([]);
      }
    });
  }, []);

  const validateInputs = () => {
    let newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(updatedOrder.name)) newErrors.name = 'Name must contain only letters and spaces';
    if (!/^[A-Za-z\s]+$/.test(updatedOrder.location)) newErrors.location = 'Location must contain only letters and spaces';
    if (!/^[A-Za-z0-9\s,\.]+$/.test(updatedOrder.address)) newErrors.address = 'Invalid address format';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedOrder.date)) newErrors.date = 'Date must be in YYYY-MM-DD format';
    if (!/^[A-Za-z0-9\s,\.]+$/.test(updatedOrder.orderNote)) newErrors.orderNote = 'Invalid characters in order note';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setOrderPrice = (id) => {
    const db = getDatabase();
    const newOrderDetails = { ...selectedOrder, price: price };

    update(ref(db, `orders/${id}`), newOrderDetails)
      .then(() => {
        Alert.alert('Price Updated', 'The price has been updated successfully.');
        setModalVisible(false);
      })
      .catch(() => Alert.alert('Error', 'Could not update the price.'));
  };

  const generateReport = async () => {
    const html = `
      <h1 style="text-align: center;">Order Report</h1>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Address</th>
            <th>Date</th>
            <th>Order Note</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${orders
            .map(
              (order) => `
            <tr>
              <td>${order.name}</td>
              <td>${order.location}</td>
              <td>${order.address}</td>
              <td>${order.date}</td>
              <td>${order.orderNote}</td>
              <td>${order.status || 'Pending'}</td>
              <td>${order.price || 'Not Set'}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const filePath = `${FileSystem.documentDirectory}OrderReport.pdf`;
      await FileSystem.copyAsync({ from: uri, to: filePath });
      Alert.alert('PDF Saved', 'The PDF has been saved to your device.');
      await Sharing.shareAsync(filePath, { mimeType: 'application/pdf', dialogTitle: 'Order Report' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate the PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Name: {item.name}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Note: {item.orderNote}</Text>
            <Text>Status: {item.status || 'Pending'}</Text>
            <Text>Price: {item.price || 'Not Set'}</Text>

            <View style={styles.buttonContainer}>
              <Button title="Set Price" onPress={() => {
                setSelectedOrder(item);
                setModalVisible(true);
              }} />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.generateReportButton} onPress={generateReport}>
        <Text style={styles.generateReportText}>Generate Report</Text>
      </TouchableOpacity>

      {/* Modal for setting price */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Price</Text>

            <TextInput
              placeholder="Enter Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.buttonContainer}>
              <Button title="Set Price" onPress={() => setOrderPrice(selectedOrder.id)} color="#28a745" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Back to Home Button at the bottom */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.replace('ChoonDrivers')}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  orderItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  generateReportButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  generateReportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay effect
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DriverOrdersScreen;
