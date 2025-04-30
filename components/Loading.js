import React from "react";
import { View, Text, ActivityIndicator, StyleSheet , Image , Linking } from "react-native";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Loading extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      message:'',
      showAlert: false,
      title:''
    };

  }

  static navigationOptions = ({ navigation}) => {
    return {
      headerTitle: 'Loading...',
      headerStyle: { backgroundColor: '#2e81e0' },
      headerTintColor: '#000000',
      headerLeft: () => {
        return null;
      }
    }
  };

  componentDidMount = async() => {
    setTimeout(async() => {
      await Linking.canOpenURL('https://google.com').then(connection => {
      if (!connection) {
        this.setState({ title: "Error!", message: 'Check Your Internet Connection!' })
        this.showAlert()
      } else {
        this.props.navigation.replace("Welcome")
      }
    });
    }, 5000);
  }

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
  };
  
  render() {
    const { showAlert } = this.state;
    return (
      <View style={styles.container}>
        <Image source={require('./../assets/logo.png')}
          style={{width: 90 + '%', height: 350}} />
        <ActivityIndicator size="large" />

        
        <AwesomeAlert
            show={showAlert}
            title={this.state.title}
            message={this.state.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            cancelText="Close"
            cancelButtonColor="#ffffff"
            onCancelPressed={() => {
              this.hideAlert();
            }}
          />

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});