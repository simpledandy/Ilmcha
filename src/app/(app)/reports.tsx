import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Text from '@components/Text';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { childId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
        <Text style={{ color: 'blue', marginLeft: 6 }}>Orqaga</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Hisobotlar</Text>

      <View style={styles.profileCircle}>
        <Image source={require('@assets/images/girl-avatar.png')} style={styles.avatar} />
      </View>

      <View style={styles.reportBox}>
        <Text style={styles.label}>HARFLAR:</Text>
        <Text style={styles.value}>78%</Text>
      </View>

      <View style={styles.reportBox}>
        <Text style={styles.label}>RAQAMLAR:</Text>
        <Text style={styles.value}>94%</Text>
      </View>

      <View style={styles.reportBox}>
        <Text style={styles.label}>UMUMIY BALLAR:</Text>
        <Text style={styles.value}>200 🪙</Text>
      </View>

      <View style={styles.reportBox}>
        <Text style={styles.label}>UMUMIY NATIJA:</Text>
        <Text style={styles.value}>86%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d99ed',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2F2FA2',
  },
  profileCircle: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'purple',
    padding: 6,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  reportBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '85%',
    padding: 16,
    borderRadius: 40,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    color: '#2F2FA2',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
