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
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchLocation, setSearchLocation] = useState(''); // State for search input
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({});
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders/');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([id, order]) => ({ id, ...order }));
        setOrders(orderList);
        setFilteredOrders(orderList); // Initially, set filtered orders to all orders
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
    });
  }, []);

  // Filter orders by location
  const filterByLocation = (location) => {
    setSearchLocation(location);
    if (location.trim() === '') {
      setFilteredOrders(orders); // Show all orders if search is empty
    } else {
      const filtered = orders.filter(order =>
        order.location.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

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

  const deleteOrder = (id) => {
    const db = getDatabase();
    remove(ref(db, `orders/${id}`))
      .then(() => Alert.alert('Deleted', 'Order deleted successfully'))
      .catch(() => Alert.alert('Error', 'Could not delete order'));
  };

  const openUpdateModal = (order) => {
    if (order.status === 'Accepted') {
      Alert.alert('Update Not Allowed', 'The order has been accepted and cannot be updated.');
      return;
    }
    setSelectedOrder(order);
    setUpdatedOrder(order);
    setModalVisible(true);
  };

  const saveUpdatedOrder = () => {
    if (!validateInputs()) {
      Alert.alert('Error', 'Please fix the errors before proceeding.');
      return;
    }

    const db = getDatabase();
    update(ref(db, `orders/${selectedOrder.id}`), updatedOrder)
      .then(() => {
        Alert.alert('Updated', 'Order updated successfully');
        setModalVisible(false);
      })
      .catch(() => Alert.alert('Error', 'Could not update order'));
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
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Location"
        value={searchLocation}
        onChangeText={filterByLocation}
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Name: {item.name}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Note: {item.orderNote}</Text>
            <Text>Status: {item.status || 'Pending'}</Text>

            <View style={styles.buttonContainer}>
              <Button title="Update" onPress={() => openUpdateModal(item)} />
              <View style={styles.buttonSpacing} />
              <Button title="Delete" color="red" onPress={() => deleteOrder(item.id)} />
              <View style={styles.buttonSpacing} />
              <Button title="Pay" color="green" onPress={() => navigation.navigate('PaymentScreen')} />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.generateReportButton} onPress={generateReport}>
        <Text style={styles.generateReportText}>Generate Report</Text>
      </TouchableOpacity>

      {/* Modal for updating order */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Order</Text>

            {/* Input Fields */}
            <TextInput
              placeholder="Name"
              value={updatedOrder.name}
              onChangeText={(text) => setUpdatedOrder({ ...updatedOrder, name: text })}
              style={[styles.input, errors.name && styles.errorInput]}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              placeholder="Location"
              value={updatedOrder.location}
              onChangeText={(text) => setUpdatedOrder({ ...updatedOrder, location: text })}
              style={[styles.input, errors.location && styles.errorInput]}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            <TextInput
              placeholder="Address"
              value={updatedOrder.address}
              onChangeText={(text) => setUpdatedOrder({ ...updatedOrder, address: text })}
              style={[styles.input, errors.address && styles.errorInput]}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={updatedOrder.date}
              onChangeText={(text) => setUpdatedOrder({ ...updatedOrder, date: text })}
              style={[styles.input, errors.date && styles.errorInput]}
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

            <TextInput
              placeholder="Order Note"
              value={updatedOrder.orderNote}
              onChangeText={(text) => setUpdatedOrder({ ...updatedOrder, orderNote: text })}
              style={[styles.input, errors.orderNote && styles.errorInput]}
            />
            {errors.orderNote && <Text style={styles.errorText}>{errors.orderNote}</Text>}

            {/* Save and Cancel Buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={saveUpdatedOrder} color="#28a745" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>
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
  buttonSpacing: {
    width: 10,
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  searchInput: {
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default OrderHistoryScreen;
