import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import 'react-native-gesture-handler';
import { getAuth, signInWithEmailAndPassword , sendPasswordResetEmail } from 'firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class ForgotPassword extends React.Component {

  static navigationOptions = ({ navigation}) => {
    return {
      headerTitle: 'Forgot Password',
      headerStyle: { backgroundColor: '#2e81e0' },
      headerTintColor: '#000000',
      headerLeft: () => {
        return null;
      }
    }
  };

  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      message:'',
      showAlert: false,
      title:''
    };
  }
  
  onSend = e => {
    if(this.state.email){

      const auth = getAuth();
      sendPasswordResetEmail(auth,this.state.email)
      .then( () => {
        this.setState({title:"Success!",message:"Please check your email...!"})
        this.showAlert()
      })
      .catch(error => {
        this.setState({title:"Error!",message:error.message})
        this.showAlert()}
      );
    }else{
      this.setState({title:"Error!",message:"Email Required!"})
      this.showAlert()
    }

  }
  
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };
 
  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: ''
    })
    this.props.navigation.navigate('Login')
  };

  render() {
    const {showAlert} = this.state;
    return (
      <View style={styles.container}>
        <Image source={require('./../assets/logo.png')}
          style={{width: 350, height: 350}} />
        
        <TextInput 
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          placeholder={'Email'}
          style={styles.input}
        />
        
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={ this.onSend }>
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.replace("Login")} style={[styles.buttonContainer, styles.registerButton]} >
          <Text style={{ color: "#000000", fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>

        <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#AEDEF4"
            onCancelPressed={() => {
              this.hideAlert()
            }}
          />

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
    width: 80 + '%',
    height: 40,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#2e81e0",
  },
  registerButton: {
    backgroundColor: "#ffc400",
  }
});