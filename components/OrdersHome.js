import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrdersHome = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#Fff', padding: 20 }}>
      
      {/* Place Order Button */}
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          backgroundColor: '#000',
          shadowColor: '#007bff',
          elevation: 5,
        }}
        onPress={() => navigation.navigate('PlaceOrderScreen')}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Place Orders</Text>
      </TouchableOpacity>

      <View style={{ marginVertical: 15 }} />

      {/* Order History Button */}
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          backgroundColor: '#28a745',
          shadowColor: '#28a745',
          elevation: 5,
        }}
        onPress={() => navigation.navigate('OrderHistoryScreen')}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Order History</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 20, width: '100%' }}>
        
        <TouchableOpacity onPress={() => navigation.navigate('ChoonHome')} style={{ alignItems: 'center' }}>
          <Icon name="home" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('OrdersHome')} style={{ alignItems: 'center' }}>
          <Icon name="car" size={30} color="#007bff" />
          <Text style={{ fontSize: 12, color: '#007bff', marginTop: 5 }}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Activities')} style={{ alignItems: 'center' }}>
          <Icon name="bars" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InAppSettings')} style={{ alignItems: 'center' }}>
          <Icon name="cog" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Settings</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default OrdersHome;
