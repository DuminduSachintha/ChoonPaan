import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const UpdateCard = ({ route, navigation }) => {
  const { cardId } = route.params; // Getting the card ID passed from the Manage Cards page
  const db = getFirestore();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  useEffect(() => {
    const fetchCardDetails = async () => {
      const cardRef = doc(db, 'cards', cardId);
      const cardSnap = await getDoc(cardRef);

      if (cardSnap.exists()) {
        const cardData = cardSnap.data();
        setCardNumber(cardData.cardNumber);
        setExpiryDate(cardData.expiryDate);
        setCardHolder(cardData.cardHolder);
      } else {
        Alert.alert("Error", "Card not found!");
      }
    };

    fetchCardDetails();
  }, [cardId]);

  const handleUpdateCard = async () => {
    if (!cardNumber || !expiryDate || !cardHolder) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const cardRef = doc(db, 'cards', cardId);
      await updateDoc(cardRef, {
        cardNumber,
        expiryDate,
        cardHolder,
      });

      Alert.alert("Success", "Card updated successfully!");
      navigation.goBack(); // Go back to the previous screen after update
    } catch (error) {
      Alert.alert("Error", "Failed to update card: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Card</Text>

      {/* Card Number Input */}
      <TextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="Card Number"
        keyboardType="numeric"
      />

      {/* Expiry Date Input */}
      <TextInput
        style={styles.input}
        value={expiryDate}
        onChangeText={setExpiryDate}
        placeholder="Expiry Date"
        keyboardType="numeric"
      />

      {/* Cardholder Name Input */}
      <TextInput
        style={styles.input}
        value={cardHolder}
        onChangeText={setCardHolder}
        placeholder="Cardholder Name"
      />

      {/* Save Changes Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateCard}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    borderRadius: 5, 
    marginBottom: 15, 
    fontSize: 16,
  },
  saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
});

export default UpdateCard;
