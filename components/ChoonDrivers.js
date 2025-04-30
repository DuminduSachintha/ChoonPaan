import React from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library

const YourComponent = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {/* Profile Icon in the upper-right corner */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 200, right: 170 }}
        onPress={() => navigation.navigate('DriverHome')} // Navigate to the Profile screen
      >
        <Icon name="user" size={100} color="#000" />
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 30, marginTop: 0 }}>
         Edit Profile
      </Text>
      </TouchableOpacity>

     
     {/* Button Wrapper with custom width and other styles */}
     <View style={{ width: '50%', marginBottom: 20, borderRadius: 8, overflow: 'hidden' }}>
        <Button
          title="Orders Feed"
          onPress={() => navigation.replace('DriverOrdersScreen')}
          color="black"
        />
      </View>

      {/* Space between buttons */}
      <View style={{ height: 0 }} />

      {/* Button Wrapper with custom width and other styles */}
      <View style={{ width: '50%', borderRadius: 8, overflow: 'hidden' }}>
        <Button
          title="Logout"
          onPress={() => navigation.replace('Login')}
          color="red"
        />
      </View>
    </View>
  );
};

export default YourComponent;
