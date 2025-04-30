import React from "react";
import { TextInput, View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { ref, getDatabase, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import RadioForm from "react-native-simple-radio-button";
import AwesomeAlert from "react-native-awesome-alerts";

const initialState = {
  email: "",
  name: "",
  password: "",
  cpassword: "",
  userType: 0, // 0 for User, 1 for Driver
  success: false,
  message: "",
  showAlert: false,
  loader: false,
  title: "",
};

export default class Register extends React.Component {
  state = initialState;

  static navigationOptions = ({ navigation}) => {
    return {
      headerTitle: 'Register',
      headerStyle: { backgroundColor: '#2e81e0' },
      headerTintColor: '#ffffff',
      headerLeft: () => {
        return null;
      }
    }
  };

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: "",
      title: "",
    });
    if (this.state.success === true) {
      this.props.navigation.replace("Login");  // Redirect after successful registration
    }
  };

  onRegister = async (e) => {
    // Validation checks
    if (!this.state.email) {
      this.setState({
        title: "Required!",
        message: "Enter an Email!",
      });
      return this.showAlert();
    }

    if (!this.state.name) {
      this.setState({
        title: "Required!",
        message: "Enter a Name!",
      });
      return this.showAlert();
    }

    if (!this.state.password) {
      this.setState({
        title: "Required!",
        message: "Enter a Password!",
      });
      return this.showAlert();
    }

    if (!this.state.cpassword) {
      this.setState({
        title: "Required!",
        message: "Confirm your Password!",
      });
      return this.showAlert();
    }

    if (this.state.password !== this.state.cpassword) {
      this.setState({
        title: "Error!",
        message: "Password & Confirm Password are not the same!",
      });
      return this.showAlert();
    }

    this.setState({ loader: true });

    const auth = getAuth();

    try {
      // Create user with email and password
      const response = await createUserWithEmailAndPassword(auth, this.state.email, this.state.password);
      const uid = response.user.uid;

      // Determine user type
      const userTypeText = this.state.userType === 0 ? 'user' : 'driver';
      const databasePath = this.state.userType === 0 ? 'users' : 'drivers';

      // Store user information in the database
      await set(ref(getDatabase(), `${databasePath}/${uid}`), {
        id: uid,
        name: this.state.name,
        email: this.state.email,
        userType: userTypeText,
        ...(this.state.userType === 1 && { status: 'pending' }) // Add status for drivers if needed
      });

      // Reset state and show success message
      this.setState({
        ...initialState,
        loader: false,
        title: "Success!",
        message: "Registration Successful!",
        success: true
      });
      this.showAlert();
    } catch (error) {
      this.setState({
        loader: false,
        title: "Error!",
        message: error.message
      });
      this.showAlert();
    }
  };

  render() {
    const { showAlert } = this.state;

    // Radio button options for user type
    const userTypeOptions = [
      { label: 'User', value: 0 },
      { label: 'Driver', value: 1 }
    ];

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image
            source={require('./../assets/logo.png')}
            style={{ width: 350, height: 350 }}
          />

          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={"Email"}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            placeholder={"Name"}
            style={styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={"Password"}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={this.state.cpassword}
            onChangeText={(cpassword) => this.setState({ cpassword })}
            placeholder={"Confirm Password"}
            secureTextEntry={true}
            style={styles.input}
          />

          {/* User Type Selection */}
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Select User Type:</Text>
            <RadioForm
              radio_props={userTypeOptions}
              initial={0}
              onPress={(value) => this.setState({ userType: value })}
              buttonColor={'#2e81e0'}
              selectedButtonColor={'#2e81e0'}
              labelColor={'#000'}
              selectedLabelColor={'#2e81e0'}
              formHorizontal={true}
              labelStyle={{ marginRight: 20 }}
            />
          </View>

          <TouchableOpacity 
            style={[styles.buttonContainer, styles.loginButton]} 
            onPress={this.onRegister}
          >
            {!this.state.loader ? (
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Register</Text>
            ) : null}
            {this.state.loader ? (
              <ActivityIndicator size="large" color={"#ffffff"} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => this.props.navigation.replace("Login")} 
            style={[styles.buttonContainer, styles.registerButton]}
          >
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
              this.hideAlert();
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + "%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
    borderBottomColor: "#c4c4c4",
    color: "#000000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: 80 + "%",
    height: 40,
    borderRadius: 60,
  },
  loginButton: {
    backgroundColor: "#2e81e0",
  },
  registerButton: {
    backgroundColor: "#ffc400",
  },
  radioContainer: {
    width: 80 + "%",
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  radioLabel: {
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
});
