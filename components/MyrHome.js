import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const MyrHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyrHome!</Text>
      <Text style={styles.text}>This is your starting point.</Text>

      {/* Shop Button in the top-right corner */}
      <View style={styles.buttonContainer}>
        <Button
          title="Store"
          onPress={() => navigation.navigate('MyrShop')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 15,
    width: '80%', // Make the container wider
  },
});

export default MyrHome;
