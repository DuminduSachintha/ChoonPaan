import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigation = useNavigation();

    const onLogin = async () => {
        if (!email || !password) {
            Alert.alert("Required!", "Please enter email and password");
            return;
        }

        setLoading(true);
        const auth = getAuth();
        const database = getDatabase();

        try {
            // Sign in user
            const res = await signInWithEmailAndPassword(auth, email, password);
            const userId = res.user.uid;

            // Check if the user is an Admin
            const adminRef = ref(database, `/admins/${userId}`);
            const adminSnapshot = await get(adminRef);

            if (adminSnapshot.exists()) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userId', userId);
                await AsyncStorage.setItem('role', 'admin');

                setLoading(false);
                navigation.replace('AdminHome');
                return;
            }

            // Check if the user is a Driver
            const driverRef = ref(database, `/drivers/${userId}`);
            const driverSnapshot = await get(driverRef);

            if (driverSnapshot.exists()) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userId', userId);
                await AsyncStorage.setItem('role', 'driver');

                setLoading(false);
                navigation.replace('ChoonDrivers');
                return;
            }

            // Check if the user is a normal user
            const userRef = ref(database, `/users/${userId}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userId', userId);
                await AsyncStorage.setItem('role', 'user');

                setLoading(false);
                navigation.replace('ChoonHome');
            } else {
                throw new Error("User data not found");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Login Failed!", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('./../assets/logo.png')}
                style={styles.logo}
            />
            
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            {loading ? <ActivityIndicator size="large" color="#ffffff" /> : null}

            <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.replace('Register')}>
                <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.replace('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#2e81e0', // Match register button's background color
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60, // Round button corners to match ForgotPassword.js
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 10,
        width: '100%',
        height: 50,
        backgroundColor: '#ffc400', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60, 
    },
    registerText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: 'bold',
    },
    forgotButton: {
        marginTop: 10,
    },
    forgotText: {
        fontSize: 16,
        color: '#530000',
    },
});

export default Login;
