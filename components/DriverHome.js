import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dblczb69y/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ChoonPaan';

const DriverHome = ({ navigation }) => {
  const auth = getAuth();
  const database = getDatabase();
  const driver = auth.currentUser;

  const [profileImage, setProfileImage] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [email, setEmail] = useState(driver?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (driver) {
        const driverRef = ref(database, `drivers/${driver.uid}`);
        const snapshot = await get(driverRef);
        if (snapshot.exists()) {
          const driverData = snapshot.val();
          setDriverName(driverData.name || '');
          setProfileImage(driverData.profileImage || null);
          setEmail(driverData.email || driver.email);
        }
      }
    };
    fetchDriverData();
  }, [driver]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      uploadToCloudinary(selectedAsset.uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'Drivers Profile/');

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setProfileImage(data.secure_url);
        saveProfileImageToDatabase(data.secure_url);
      } else {
        Alert.alert('Upload Failed', 'Failed to upload image.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileImageToDatabase = async (imageUrl) => {
    if (driver) {
      const driverRef = ref(database, `drivers/${driver.uid}`);
      const snapshot = await get(driverRef);
      const driverData = snapshot.exists() ? snapshot.val() : {};

      await set(driverRef, { ...driverData, profileImage: imageUrl }); // Only update profileImage
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleSave = async () => {
    if (driverName.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (email.trim() === '') {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    try {
      const driverRef = ref(database, `drivers/${driver.uid}`);
      const snapshot = await get(driverRef);
      const driverData = snapshot.exists() ? snapshot.val() : {};

      const updatedData = {};
      if (driverName !== driverData.name) updatedData.name = driverName;
      if (email !== driverData.email) updatedData.email = email;

      await set(driverRef, { ...driverData, ...updatedData });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>
      
      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/default-avatar.png')}
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>

      {/* Driver Name Input */}
      <TextInput
        style={styles.input}
        value={driverName}
        onChangeText={setDriverName}
        placeholder="Enter Name"
        placeholderTextColor="#aaa"
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter Email"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#444',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#6200ee',
    borderRadius: 100,
    padding: 5,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  input: {
    width: '85%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    marginTop: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    marginTop: 15,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DriverHome;
