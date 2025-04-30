import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyrAdminShop = () => {
  const navigation = useNavigation(); 

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    const initialItems = [
      { id: '1', name: 'Cool Hat', price: '50', image: 'https://example.com/hat.jpg' },
      { id: '2', name: 'Stylish Glasses', price: '30', image: 'https://example.com/glasses.jpg' },
    ];
    setItems(initialItems);
  }, []);

  const handleSaveItem = () => {
    if (isEditing) {
      setItems(items.map(item =>
        item.id === currentItemId
          ? { ...item, name: itemName, price: itemPrice, image: itemImage }
          : item
      ));
    } else {
      const newItem = {
        id: (items.length + 1).toString(),
        name: itemName,
        price: itemPrice,
        image: itemImage,
      };
      setItems([...items, newItem]);
    }

    setItemName('');
    setItemPrice('');
    setItemImage('');
    setIsEditing(false);
    setCurrentItemId(null);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEditItem = (item) => {
    setItemName(item.name);
    setItemPrice(item.price);
    setItemImage(item.image);
    setIsEditing(true);
    setCurrentItemId(item.id);
  };

  return (
    <View style={styles.container}>
      {/* Back to Admin Home Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminHome')}>
        <Text style={styles.backButtonText}>← Back to Admin Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Admin - Manage Shop Items</Text>

      <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
      <TextInput style={styles.input} placeholder="Item Price" value={itemPrice} onChangeText={setItemPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Item Image URL" value={itemImage} onChangeText={setItemImage} />

      <Button title={isEditing ? "Update Item" : "Add Item"} onPress={handleSaveItem} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            </View>
            <View style={styles.itemActions}>
              <Button title="Edit" onPress={() => handleEditItem(item)} />
              <Button title="Delete" onPress={() => handleDeleteItem(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#008000',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#777',
  },
  itemActions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default MyrAdminShop;
