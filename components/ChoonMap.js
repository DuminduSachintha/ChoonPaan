import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const ChoonMap = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      {/* Full-Screen Map */}
      <MapView style={styles.map} showsUserLocation={true} />

   

      

      {/* Centered Notify Button */}
      <View style={styles.notifyContainer}>
        <TouchableOpacity 
          style={styles.notifyButton}
          onPress={() => console.log('Notify Choon Pressed')}
        >
          <Text style={styles.notifyText}>Notify Choon</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => console.log('Home Pressed')} style={styles.navItem}>
          <Icon name="home" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('OrdersHome')} style={styles.navItem}>
          <Icon name="car" size={30} color="#333" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Activities')} style={styles.navItem}>
          <Icon name="bars" size={30} color="#333" />
          <Text style={styles.navText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('InAppSettings')} style={styles.navItem}>
          <Icon name="cog" size={30} color="#333" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
    position: 'absolute',
  },
  shopButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  shopText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  topRightContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  profileButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  notifyContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  notifyButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 10,
  },
  notifyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
});

export default ChoonMap;
