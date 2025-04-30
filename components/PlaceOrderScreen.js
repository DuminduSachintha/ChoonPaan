import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal, FlatList } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';

const PlaceOrderScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [errors, setErrors] = useState({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Format date as YYYY-MM-DD
  const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  // Validate inputs
  const validateInputs = () => {
    let newErrors = {};

    // Name validation: Only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = 'Name must contain only letters and spaces';

    // Location validation: Letters, numbers, spaces, and commas
    if (!/^[A-Za-z0-9\s,]+$/.test(location)) newErrors.location = 'Location must contain only letters, numbers, spaces, and commas';

    // Address validation: Allow letters, numbers, commas, periods, hyphens, spaces
    if (!/^[A-Za-z0-9\s,.\-]+$/.test(address)) newErrors.address = 'Address must contain only letters, numbers, commas, periods, hyphens, and spaces';

    // Date validation: Format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) newErrors.date = 'Date must be in YYYY-MM-DD format';

    // Order note validation: Letters, numbers, commas, periods
    if (!/^[A-Za-z0-9\s,\.]+$/.test(orderNote)) newErrors.orderNote = 'Order note must contain only letters, numbers, commas, and periods';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place the order and save to Firebase
  const placeOrder = async () => {
    if (!validateInputs()) {
      Alert.alert('Error', 'Please fix the errors before proceeding.');
      return;
    }

    const db = getDatabase();
    const orderId = Date.now().toString(); // Unique ID for the order (using current timestamp)

    try {
      // Save order to Firebase
      await set(ref(db, 'orders/' + orderId), {
        name,
        location,
        address,
        date,
        orderNote,
        status: 'Pending', // Set order status as "Pending"
      });

      Alert.alert('Success', 'Order placed successfully');
      navigation.navigate('OrderHistory'); // Navigate to OrderHistory screen
    } catch (error) {
      Alert.alert('Error', 'Could not place order');
    }
  };

  // Handle date change from the calendar picker
  const handleDateSelect = (selectedDate) => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Ensure the selected date is not in the past
    if (selectedDateObj < today) {
      Alert.alert('Invalid Date', 'You cannot select a past date.');
      return;
    }

    // Format the date and set it to the state
    setDate(formatDate(selectedDateObj));
    setDatePickerVisible(false);
  };

  // Show calendar modal
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Generate days for the current month (excluding previous days)
  const generateCalendarDays = () => {
    const today = new Date();
    const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();

    let days = [];

    // Fill in empty days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i);
      // Only add days that are equal to or after today's date
      if (day >= today) {
        days.push(day);
      } else {
        days.push(null);
      }
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place Your Order</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, errors.name && styles.inputError]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Select Location"
        value={location}
        onChangeText={setLocation}
        style={[styles.input, errors.location && styles.inputError]}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={[styles.input, errors.address && styles.inputError]}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={[styles.input, errors.date && styles.inputError]}
      />
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>
      {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

      <TextInput
        placeholder="Order Items/Note"
        value={orderNote}
        onChangeText={setOrderNote}
        style={[styles.input, errors.orderNote && styles.inputError]}
      />
      {errors.orderNote && <Text style={styles.errorText}>{errors.orderNote}</Text>}

      <TouchableOpacity style={styles.button} onPress={placeOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>

      {/* Custom Calendar Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDatePickerVisible}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Date</Text>

            {/* Calendar Controls */}
            <View style={styles.calendarControls}>
              <TouchableOpacity onPress={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))} >
                <Text style={styles.calendarControlText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.calendarMonthYear}>
                {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))} >
                <Text style={styles.calendarControlText}>Next</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar Days */}
            <FlatList
              data={generateCalendarDays()}
              numColumns={7}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dayButton, item ? styles.dayButtonActive : styles.dayButtonInactive]}
                  onPress={() => item && handleDateSelect(item)}
                  disabled={!item} // Disable previous days
                >
                  <Text style={styles.dayButtonText}>{item ? item.getDate() : ''}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              key={7}
            />

            <TouchableOpacity onPress={() => setDatePickerVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  calendarControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calendarControlText: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendarMonthYear: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    margin: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#007bff',
  },
  dayButtonInactive: {
    backgroundColor: '#e0e0e0',
  },
  dayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlaceOrderScreen;
