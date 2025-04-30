import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, TouchableOpacity, Text, Image , AsyncStorage } from 'react-native';
import 'react-native-gesture-handler';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.loadData();
  }

  loadData = async() =>{
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
    if(isLoggedIn==='true'){
      this.props.navigation.replace('MainPage')
    }
  }

  static navigationOptions = {
    headerTitle: 'Welcome',
    headerStyle: { backgroundColor: '#2e81e0' },
    headerTintColor: '#000000',
    headerLeft: () => {
      return null;
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./../assets/logo.png')}
          style={{width: 90 + '%', height: 350}} />
        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <Text style={{ fontWeight: 'bold' , fontSize: 50 }}>Welcome</Text>
        </View>
        
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() =>  this.props.navigation.replace('Login')}>
          <Text style={{color: '#000000', fontWeight: 'bold'}}>Start</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + '%',
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 4, 
    borderBottomColor: '#c4c4c4',
    color: '#000000'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width: 30 + '%',
    height: 40,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#2e81e0",
  }
});