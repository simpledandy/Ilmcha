import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const router = useRouter();

  const handleSave = () => {
    // Validate and save info, maybe to AsyncStorage
    if (name && age) {
      // save logic here
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.backText} onPress={() => router.back()}>← Orqaga</Text>

      <Text style={styles.title}>Yangi Hisob</Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={require('@/assets/images/avatar-placeholder.jpg')} // Replace with your avatar image
          style={styles.avatar}
        />
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Farzandingiz ismi"
          placeholderTextColor="#BFE4FF"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Farzandingiz yoshi"
          placeholderTextColor="#BFE4FF"
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>SAQLASH</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clouds}>
        <Image source={require('@/assets/images/cloud-left.png')} style={styles.cloud} />
        <Image source={require('@/assets/images/cloud-right.png')} style={styles.cloud} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFE4',
    alignItems: 'center',
    paddingTop: 40,
  },
  backText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3366CC',
    marginVertical: 16,
    fontFamily: 'ComicSansMS', // use playful font if available
  },
  avatarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 10,
    borderWidth: 4,
    borderColor: '#4DB8FF',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  form: {
    backgroundColor: '#4DB8FF',
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#71C9F8',
    borderRadius: 20,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
  },
  button: {
    backgroundColor: '#FFEFE4',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  buttonText: {
    color: '#4DB8FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clouds: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cloud: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
});
