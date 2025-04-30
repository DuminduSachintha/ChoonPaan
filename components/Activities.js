import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, TouchableOpacity, Text } from 'react-native';

const Activities = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 }}>
      
      
    

      <TouchableOpacity
        style={{ backgroundColor: '#28a745', paddingVertical: 10, paddingHorizontal: 90, borderRadius: 5, marginVertical: 20 }}
        onPress={() => navigation.navigate('OrderHistoryScreen')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Your Order History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 80, borderRadius: 5, marginVertical: 5, marginBottom: -400 }}
        onPress={() => navigation.navigate('PaymentHistory')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>View Payment History</Text>
      </TouchableOpacity>


    

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
            <TouchableOpacity onPress={() => console.log('Activities Pressed')} style={{ alignItems: 'center' }}>
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

export default Activities;
