import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppText, AppButton } from '../../components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const setLanguage = (lang: 'en' | 'uz' | 'ru') => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirmMessage', { defaultValue: 'Are you sure you want to logout?' }),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('logout'), onPress: logout },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppText variant="heading1" weight="Bold" style={styles.title}>
        {t('settings')}
      </AppText>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setLanguage('uz')} style={{ marginHorizontal: 8, opacity: i18n.language === 'uz' ? 1 : 0.5 }}>
          <AppText>{t('languageUzbek')}</AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('en')} style={{ marginHorizontal: 8, opacity: i18n.language === 'en' ? 1 : 0.5 }}>
          <AppText>{t('languageEnglish')}</AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('ru')} style={{ marginHorizontal: 8, opacity: i18n.language === 'ru' ? 1 : 0.5 }}>
          <AppText>{t('languageRussian')}</AppText>
        </TouchableOpacity>
      </View>
      <AppButton onPress={handleLogout} variant="secondary">
        {t('logout')}
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
});
