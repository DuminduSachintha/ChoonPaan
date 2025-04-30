import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Register from './components/Register';
import Loading from './components/Loading';
import ForgotPassword from './components/ForgotPassword';
import Welcome from './components/Welcome';

import DriverHome from './components/DriverHome';
import AdminHome from './components/AdminHome';
import UserHome from './components/UserHome';

import ManageDrivers from './components/ManageDrivers';
import ManageUsers from './components/ManageUsers';
import ViewReports from './components/ViewReports';

import CardDetails from './components/CardDetails';
import ManageCards from './components/ManageCards';
import UserPayments from './components/UserPayments';
import UpdateCard from './components/UpdateCard';

import PaymentScreen from './components/PaymentScreen';
import PaymentHistory from './components/PaymentHistory';
import SetPricesScreen from './components/SetPricesScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import PlaceOrderScreen from './components/PlaceOrderScreen';
import OrdersHome from './components/OrdersHome';
import DriverOrdersScreen from './components/DriverOrdersScreen';
import ChoonHome from './components/ChoonHome';
import Activities from './components/Activities';
import InAppSettings from './components/InAppSettings';
import MyrHome from './components/MyrHome';
import MyrShop from './components/MyrShop';
import MyrAdminShop from './components/MyrAdminShop';
import AdminOrders from './components/AdminOrders';
import AdminPayments from './components/AdminPayments';
import ChoonQR from './components/ChoonQR';
import ChoonDrivers from './components/ChoonDrivers';
import ChoonMap from './components/ChoonMap';


import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';


// Ignore warnings
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...'], (isAffected, bundle) => {
  return isAffected || bundle.includes('example.js');
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJOqCp0CnuS6b9u98gkKnyUbLXLTzSgP4",
  authDomain: "choon-paan-a632c.firebaseapp.com",
  projectId: "choon-paan-a632c",
  storageBucket: "choon-paan-a632c.appspot.com",
  messagingSenderId: "837744118873",
  appId: "1:837744118873:web:8c20b5fb51d70541d2f548",
  measurementId: "G-KKT0B0GW7J"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Create stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
   <Stack.Navigator initialRouteName="Loading">
  {/* Auth Screens */}
  <Stack.Screen name="Loading" component={Loading} />
  <Stack.Screen name="Welcome" component={Welcome} />
  <Stack.Screen name="Login" component={Login} />
  <Stack.Screen name="Register" component={Register} />
  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

  {/* Role-Based Screens */}
  <Stack.Screen name="DriverHome" component={DriverHome} />
  <Stack.Screen name="AdminHome" component={AdminHome} />

  {/* UserHome Screen with Header Removed */}
  <Stack.Screen 
    name="UserHome" 
    component={UserHome} 
    options={{ headerShown: false }}  
  />

  {/* Admin Screens */}
  <Stack.Screen name="ManageDrivers" component={ManageDrivers} />
  <Stack.Screen name="ManageUsers" component={ManageUsers} />
  <Stack.Screen name="ViewReports" component={ViewReports} />

  {/* Payment Screens */}
  <Stack.Screen name="CardDetails" component={CardDetails} />
  <Stack.Screen name="ManageCards" component={ManageCards} />
  <Stack.Screen name="UserPayments" component={UserPayments} />
  <Stack.Screen name="UpdateCard" component={UpdateCard} />



  <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
  <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
  <Stack.Screen name="SetPricesScreen" component={SetPricesScreen} />
  <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
  <Stack.Screen name="PlaceOrderScreen" component={PlaceOrderScreen} />
  <Stack.Screen name="OrdersHome" component={OrdersHome} />
  <Stack.Screen name="DriverOrdersScreen" component={DriverOrdersScreen} />
  <Stack.Screen name="Activities" component={Activities} />
  <Stack.Screen name="InAppSettings" component={InAppSettings} />
  <Stack.Screen name="MyrAdminShop" component={MyrAdminShop} />
  <Stack.Screen name="MyrShop" component={MyrShop} />
  <Stack.Screen name="MyrHome" component={MyrHome} />
  <Stack.Screen name="AdminOrders" component={AdminOrders} />
  <Stack.Screen name="AdminPayments" component={AdminPayments} />
  <Stack.Screen name="ChoonQR" component={ChoonQR} />
  <Stack.Screen name="ChoonDrivers" component={ChoonDrivers} />
  <Stack.Screen name="ChoonMap" component={ChoonMap} />
  


  {/* ChoonHome Screen with Header Removed */}
  <Stack.Screen 
    name="ChoonHome" 
    component={ChoonHome} 
    options={{ headerShown: false }}  
  />
</Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;
