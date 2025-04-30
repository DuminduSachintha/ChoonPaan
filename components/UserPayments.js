import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, TouchableOpacity, Text, Image } from 'react-native';

const UserPayments = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 }}>
      
      {/* Dummy QR Code */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }}  // Replace this with the actual QR code image URL
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />
      
      {/* Dummy Button before Make Payment */}
           <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 10,
          paddingHorizontal: 110,
          borderRadius: 5,
          marginVertical: 10,
        }}
        onPress={() => navigation.navigate('ChoonQR')} // Navigate to ChoonQR
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Pay via QR</Text>
      </TouchableOpacity>

      {/* Button to navigate to PaymentScreen */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 10,
          paddingHorizontal: 100,
          borderRadius: 5,
          marginVertical: 10,
          marginTop: 20, // Adds more space at the bottom
        }}
        onPress={() => navigation.navigate('PaymentScreen', { price: '100' })} >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Make Payment</Text>
      </TouchableOpacity>

      {/* Button to navigate to PaymentHistory */}
      <TouchableOpacity
        style={{
          backgroundColor: '#28a745',
          paddingVertical: 10,
          paddingHorizontal: 80,
          borderRadius: 5,
          marginVertical: 20,
          marginBottom: -100
        }}
        onPress={() => navigation.navigate('PaymentHistory')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>View Payment History</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 30, width: '110%' }}>
        {/* Home Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ChoonHome')} // Navigate to OrdersHome
          style={{ alignItems: 'center' }}
        >
          <Icon name="home" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Home</Text>
        </TouchableOpacity>

        {/* Orders Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('OrdersHome')} // Navigate to OrdersHome
          style={{ alignItems: 'center' }}
        >
          <Icon name="car" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Orders</Text>
        </TouchableOpacity>

        {/* Activities Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Activities')} // Navigate to OrdersHome
          style={{ alignItems: 'center' }}
        >
          <Icon name="bars" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Activities</Text>
        </TouchableOpacity>

        {/* Settings Icon with Text */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('InAppSettings')} // Navigate to OrdersHome
          style={{ alignItems: 'center' }}
        >
          <Icon name="cog" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Settings</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default UserPayments;
