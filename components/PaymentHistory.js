import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchPrice, setSearchPrice] = useState('');
  const db = getFirestore();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    if (searchPrice) {
      const filteredPayments = paymentHistory.filter((payment) => 
        payment.amount.toString().includes(searchPrice)
      );
      setFilteredHistory(filteredPayments);
    } else {
      setFilteredHistory(paymentHistory);
    }
  }, [searchPrice, paymentHistory]);

  const fetchPaymentHistory = async () => {
    const querySnapshot = await getDocs(collection(db, 'paymentHistory'));
    const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPaymentHistory(payments);
    setFilteredHistory(payments);
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Payment", "Are you sure you want to delete this payment record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'paymentHistory', id));
            setPaymentHistory(paymentHistory.filter(item => item.id !== id));
            setFilteredHistory(filteredHistory.filter(item => item.id !== id));
            Alert.alert("Deleted", "Payment record deleted successfully.");
          } catch (error) {
            Alert.alert("Error", "Failed to delete payment: " + error.message);
          }
        },
        style: "destructive"
      }
    ]);
  };

  const generateReport = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Payment History Report</h1>
          <table>
            <tr>
              <th>Amount</th>
              <th>Card Used</th>
            </tr>
            ${filteredHistory.map(item => `
              <tr>
                <td>$${item.amount}</td>
                <td>${item.cardUsed}</td>
              </tr>`).join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Payment History</Text>

      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20 }}
        placeholder="Search by price"
        value={searchPrice}
        onChangeText={setSearchPrice}
        keyboardType="numeric"
      />

     
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, color: '#333' }}>Amount: ${item.amount}</Text>
              <Text style={{ fontSize: 18, color: '#333' }}>Card Used: {item.cardUsed}</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 }}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
       <TouchableOpacity
        style={{ backgroundColor: '#007BFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 5, marginBottom: 20, alignItems: 'center' }}
        onPress={generateReport}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Generate Report</Text>
      </TouchableOpacity>

    </View>
  );
};

export default PaymentHistory;
