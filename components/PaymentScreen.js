import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const PaymentScreen = () => {
  const [cards, setCards] = useState([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const price = route.params?.price;
  const db = getFirestore();

  useEffect(() => {
    const fetchCards = async () => {
      const snapshot = await getDocs(collection(db, 'cards'));
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCards();
  }, []);

  const handlePayment = async (card) => {
    if (!card) {
      Alert.alert('Error', 'Please select a card to make the payment.');
      return;
    }

    const paymentData = {
      amount: price,
      cardUsed: `**** **** **** ${card.cardNumber.slice(-4)}`,
      date: new Date().toLocaleString(),
    };

    try {
      await addDoc(collection(db, 'paymentHistory'), paymentData);
      setReceiptData(paymentData);
      setReceiptVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to save payment history.');
      console.error(error);
    }
  };

  const generateReport = async () => {
    if (!receiptData) return;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Payment Receipt</h2>
          <p><strong>Amount Paid:</strong> Rs.${receiptData.amount}</p>
          <p><strong>Card Used:</strong> ${receiptData.cardUsed}</p>
          <p><strong>Date:</strong> ${receiptData.date}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Total amount: Rs.{price}</Text>

      <Text style={{ fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>Select a Card to Pay</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1, marginBottom: 10 }}>
            <Text>**** **** **** {item.cardNumber.slice(-4)}</Text>
            <Text>{item.expiryDate} - {item.cardHolder}</Text>

            <TouchableOpacity
              style={{ backgroundColor: '#000', padding: 10, borderRadius: 5, marginTop: 10 }}
              onPress={() => handlePayment(item)}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add New Card Button at Bottom */}
      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
        }}
        onPress={() => navigation.navigate('CardDetails')}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>+ Add New Card</Text>
      </TouchableOpacity>

      {/* Receipt Modal */}
      <Modal visible={receiptVisible} animationType="slide" transparent={true}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Payment Successful</Text>
            {receiptData && (
              <>
                <Text style={{ fontSize: 18, marginVertical: 5 }}>Amount: Rs.{receiptData.amount}</Text>
                <Text style={{ fontSize: 18, marginVertical: 5 }}>Card: {receiptData.cardUsed}</Text>
                <Text style={{ fontSize: 18, marginVertical: 5 }}>Date: {receiptData.date}</Text>

                <TouchableOpacity
                  style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10 }}
                  onPress={generateReport}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Generate Report</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginTop: 10 }}
              onPress={() => setReceiptVisible(false)}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;
