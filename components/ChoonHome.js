import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

const ChoonHome = ({ navigation }) => {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#EDE8D0' }}>
      {/* Shop Icon and Text on Left Upper Corner */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('MyrHome')}
        style={{ position: 'absolute', top: 80, left: 20, flexDirection: 'row', alignItems: 'center' }}
      >
        <Icon name="shopping-cart" size={24} color="#333" />
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#333', marginLeft: 5 }}>Shop</Text>
      </TouchableOpacity>

      {/* Top Row: Profile & Logout */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 50, marginTop: 50 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#333', marginRight: 10 }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 3 }} 
          onPress={() => navigation.navigate('UserHome')}>
          <Icon name="user" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 50 }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 60, borderRadius: 10, marginRight: 10 }}
          onPress={() => navigation.navigate('UserPayments')}>
          <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 55, borderRadius: 10 }}
          onPress={() => navigation.navigate('PlaceOrderScreen')}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Place orders</Text>
        </TouchableOpacity>
      </View>

      {/* Text Below Buttons */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'left' }}>Find Choons near you</Text>
      </View>

      {/* Touchable Map to Navigate to ChoonMap */}
      <TouchableOpacity onPress={() => navigation.navigate('ChoonMap')}>
        <View style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 30 }}>
          <View style={{ borderWidth: 1, borderColor: '#8F8F8F', borderRadius: 20, overflow: 'hidden' }}>
            <MapView
              style={{ width: '100%', height: 400 }}
              showsUserLocation={true}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Notify Choon Button */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 45, borderRadius: 10 }}
          onPress={() => console.log('Map Button Pressed')}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Notify Choon</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 30, width: '110%' }}>
        <TouchableOpacity onPress={() => console.log('Home Pressed')} style={{ alignItems: 'center' }}>
          <Icon name="home" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OrdersHome')} style={{ alignItems: 'center' }}>
          <Icon name="car" size={30} color="#333" />
          <Text style={{ fontSize: 12, color: '#333', marginTop: 5 }}>Orders</Text>
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

export default ChoonHome;
