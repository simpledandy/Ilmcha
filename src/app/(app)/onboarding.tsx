import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Button from '@components/Button';
import Input from '@components/Input';
import Text from '@components/Text';
import Images from '@constants/images';
import i18n from 'i18n';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSave = () => {
    if (name && age) {
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{i18n.t('back')}</Text>
      </TouchableOpacity>

      <Text variant="heading1" style={styles.title}>
        {i18n.t('newAccount')}
      </Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={require('@assets/images/boy-avatar.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Input
          placeholder={i18n.t('childNamePlaceholder')}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Input
          placeholder={i18n.t('childAgePlaceholder')}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button
          variant="primary"
          size="large"
          onPress={handleSave}
          style={styles.button}
        >
          {i18n.t('save')}
        </Button>
      </View>

      <View style={styles.clouds}>
        <Image source={require('@assets/images/cloud-left.png')} style={styles.cloud} />
        <Image source={require('@assets/images/cloud-right.png')} style={styles.cloud} />
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
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    marginVertical: 16,
    color: '#3366CC',
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
    width: '100%',
    marginBottom: 16,
    color: 'white',
  },
  button: {
    marginTop: 10,
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