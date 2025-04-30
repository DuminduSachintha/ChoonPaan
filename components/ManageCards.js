import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ManageCards = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const snapshot = await getDocs(collection(db, 'cards'));
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCards();
  }, []);

  const handleDeleteCard = async (id) => {
    try {
      await deleteDoc(doc(db, 'cards', id));
      setCards(cards.filter(card => card.id !== id));
      Alert.alert("Success", "Card deleted!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete card: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 15, borderBottomWidth: 1, marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>**** **** **** {item.cardNumber.slice(-4)}</Text>
            <Text>{item.expiryDate} - {item.cardHolder}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              {/* Update button navigation */}
              <TouchableOpacity 
                style={{ backgroundColor: '#000', padding: 10, borderRadius: 5, marginRight: 5 }} 
                onPress={() => navigation.navigate('UpdateCard', { cardId: item.id })}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Update</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5 }} 
                onPress={() => handleDeleteCard(item.id)}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 20 }} 
        onPress={() => navigation.navigate('CardDetails')}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>+ Add New Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageCards;
