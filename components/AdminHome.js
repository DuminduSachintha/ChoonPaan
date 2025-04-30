import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

const AdminHome = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Admin Dashboard!</Text>
      <Text style={styles.text}>You are logged in as an Admin.</Text>

      {/* Example Dashboard Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Manage Users"
          onPress={() => navigation.navigate('ManageUsers')}
          color="#6200ee"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Manage Drivers"
          onPress={() => navigation.navigate('ManageDrivers')}
          color="#6200ee"
        />
      </View>


      <View style={styles.buttonContainer}>
        <Button
          title="View Reports"
          onPress={() => navigation.navigate('ViewReports')}
          color="#6200ee"
        />
      </View>
     

      <View style={styles.buttonContainer}>
        <Button
          title="User Payments"
          onPress={() => navigation.replace('AdminPayments')}
          color="#6200ee"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="User Orders"
          onPress={() => navigation.replace('AdminOrders')}
          color="#6200ee"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Manage Store"
          onPress={() => navigation.replace('MyrAdminShop')}
          color="#6200ee"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={() => navigation.replace('Login')}
          color="#ff4444"
        />
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
});

export default AdminHome;
