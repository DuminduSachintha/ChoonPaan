import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';

const InAppSettings = ({ navigation }) => {
  const [searchText, setSearchText] = useState(''); // State for handling search input

  const handleSearchChange = (text) => {
    setSearchText(text);
    // Implement filtering or other actions based on the searchText here
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 }}>
      
      {/* Search Bar at the top */}
      <TextInput
        style={{
          width: '100%',
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          paddingLeft: 10,
          marginBottom: 20,
          fontSize: 16,
        }}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearchChange}
      />

      {/* Main content */}
     

      {/* Manage Cards Button - Stick to bottom */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('ManageCards')} 
        style={{
          backgroundColor: '#1E1E1E', 
          paddingVertical: 10, 
          paddingHorizontal: 35, 
          borderRadius: 5, 
          marginBottom:200 // Added margin to ensure it's not sticking too tight to the bottom
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Manage your cards</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 30, width: '100%' }}>
        {/* Home Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ChoonHome')} 
          style={{ alignItems: 'center' }}
        >
          <Icon name="home" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Home</Text>
        </TouchableOpacity>

        {/* Orders Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('OrdersHome')} 
          style={{ alignItems: 'center' }}
        >
          <Icon name="car" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Orders</Text>
        </TouchableOpacity>

        {/* Activities Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Activities')} 
          style={{ alignItems: 'center' }}
        >
          <Icon name="bars" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Activities</Text>
        </TouchableOpacity>

        {/* Settings Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('InAppSettings')} 
          style={{ alignItems: 'center' }}
        >
          <Icon name="cog" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InAppSettings;
