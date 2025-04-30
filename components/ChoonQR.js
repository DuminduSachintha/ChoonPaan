import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera } from 'expo-camera';

const ChoonQR = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 }}>
      
      {/* Camera View */}
      {isCameraVisible && (
        <View style={{ width: 300, height: 400, borderRadius: 10, overflow: 'hidden', marginBottom: -290,marginTop: 150 }}>
          <Camera 
            style={{ flex: 1 }} 
            type={Camera.Constants.Type.back} 
            ref={ref => setCameraRef(ref)}
          />
        </View>
      )}

      {/* Dummy QR Code */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/300' }}  
        style={{ width: 300, height: 300, marginBottom: 20 }} 
      />

      {/* Pay via QR Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 10,
          paddingHorizontal: 110,
          borderRadius: 5,
          marginVertical: 10,
          marginBottom:200
        }}
        onPress={() => navigation.navigate('ChoonQR')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Pay via QR</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 30, width: '100%' }}>
        <TouchableOpacity onPress={() => navigation.navigate('ChoonHome')} style={{ alignItems: 'center' }}>
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

export default ChoonQR;
