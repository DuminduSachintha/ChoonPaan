import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, TextInput } from 'react-native';

const MyrShop = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [searchPrice, setSearchPrice] = useState(''); // State to hold the search input for price
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items

  // Example of items data, could be fetched from an API or similar
  useEffect(() => {
    const initialItems = [
      { id: '1', name: 'Cool Hat', price: 50, image: 'https://example.com/hat.jpg' },
      { id: '2', name: 'Stylish Glasses', price: 30, image: 'https://example.com/glasses.jpg' },
      { id: '3', name: 'Trendy Jacket', price: 80, image: 'https://example.com/jacket.jpg' },
      { id: '4', name: 'Comfy Shoes', price: 40, image: 'https://example.com/shoes.jpg' },
    ];
    setItems(initialItems);
    setFilteredItems(initialItems); // Initially show all items
  }, []);

  // Filter items based on price
  useEffect(() => {
    if (searchPrice === '') {
      setFilteredItems(items); // Show all items if searchPrice is empty
    } else {
      const filtered = items.filter(item => item.price <= parseFloat(searchPrice));
      setFilteredItems(filtered);
    }
  }, [searchPrice, items]);

  const handleBuyItem = (item) => {
    // Navigate to PaymentScreen and pass the selected item
    navigation.navigate('PaymentScreen', { item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyrShop - Customize Your Profile</Text>

      {/* Price Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by price (e.g. 50)"
        keyboardType="numeric"
        value={searchPrice}
        onChangeText={(text) => setSearchPrice(text)}
      />

      {/* Display items for users to browse */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Price: ${item.price}</Text>
              <Button title="Buy" onPress={() => handleBuyItem(item)} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
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
});

export default MyrShop;
