import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CardDetails = () => {
  const navigation = useNavigation();
  const db = getFirestore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};

    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }
    if (!/^\d{4}$/.test(expiryDate.replace('/', ''))) {
      newErrors.expiryDate = 'Expiry date must be 4 digits (MMYY).';
    }
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }
    if (!/^[A-Za-z\s]+$/.test(cardHolder)) {
      newErrors.cardHolder = 'Name must contain only letters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Please fix the errors before proceeding.');
      return;
    }

    try {
      await addDoc(collection(db, 'cards'), {
        cardNumber,
        expiryDate,
        cvv,
        cardHolder
      });

      Alert.alert('Success', 'Card added successfully!');
      navigation.navigate('ManageCards');
    } catch (error) {
      Alert.alert('Error', 'Failed to add card: ' + error.message);
    }
  };

  const handleExpiryDateChange = (text) => {
    // Remove all non-numeric characters
    let formattedText = text.replace(/[^\d]/g, '');

    // Limit to 4 digits (MM/YY)
    if (formattedText.length <= 4) {
      // Extract the month and year
      const month = formattedText.slice(0, 2);
      const year = formattedText.slice(2, 4);

      // Check if the month is valid (<= 12)
      if (month && parseInt(month) > 12) {
        formattedText = month.slice(0, 1); // Keep only the first digit
      }

      // Check if the year is valid (<= 31)
      if (year && parseInt(year) > 31) {
        formattedText = formattedText.slice(0, 3); // Keep only 3 digits
      }

      // Format as MM/YY
      if (formattedText.length > 2) {
        formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}`;
      }

      setExpiryDate(formattedText);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Card Number</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginTop: 5 }}
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="1234567890123456"
      />
      {errors.cardNumber && <Text style={{ color: 'red' }}>{errors.cardNumber}</Text>}

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Expiry Date (MM/YY)</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginTop: 5 }}
        keyboardType="numeric"
        maxLength={5}
        value={expiryDate}
        onChangeText={handleExpiryDateChange}
        placeholder="MM/YY"
      />
      {errors.expiryDate && <Text style={{ color: 'red' }}>{errors.expiryDate}</Text>}

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>CVV</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginTop: 5 }}
        keyboardType="numeric"
        maxLength={3}
        value={cvv}
        onChangeText={setCvv}
        secureTextEntry={true}
        placeholder="123"
      />
      {errors.cvv && <Text style={{ color: 'red' }}>{errors.cvv}</Text>}

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Cardholder Name</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 5, marginTop: 5 }}
        value={cardHolder}
        onChangeText={setCardHolder}
        placeholder="John Doe"
      />
      {errors.cardHolder && <Text style={{ color: 'red' }}>{errors.cardHolder}</Text>}

      <TouchableOpacity
        style={{
          backgroundColor: '#28a745',
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
          alignItems: 'center',
        }}
        onPress={handleAddCard}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardDetails;
