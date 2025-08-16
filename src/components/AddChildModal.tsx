import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { AppInput } from './AppInput';
import { CuteDatePicker } from './CuteDatePicker';
import { colors } from '@theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { AddChildData } from '../types/children';

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onAddChild: (childData: AddChildData) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  visible,
  onClose,
  onAddChild,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; birthDate?: string } = {};

    if (!name.trim()) {
      newErrors.name = t('childNameRequired');
    } else if (name.trim().length < 2) {
      newErrors.name = t('childNameTooShort');
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age > 18) {
      newErrors.birthDate = t('childAgeTooOld');
    } else if (age < 0) {
      newErrors.birthDate = t('childAgeInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const result = await onAddChild({
        name: name.trim(),
        date_of_birth: birthDate.toISOString().split('T')[0],
      });

      if (result.success) {
        handleClose();
      } else {
        Alert.alert(t('error'), result.error || t('addChildError'));
      }
    } catch (error) {
      console.error('Error adding child:', error);
      Alert.alert(t('error'), t('addChildError'));
    }
  };

  const handleClose = () => {
    setName('');
    setBirthDate(new Date());
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.neutral[500]} />
            </TouchableOpacity>
            <AppText style={styles.modalTitle}>{t('addChild')}</AppText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-add" size={48} color={colors.primary[300]} />
              </View>
              <AppText style={styles.avatarText}>{t('addChildAvatar')}</AppText>
            </View>

            <View style={styles.formSection}>
              <AppText style={styles.sectionTitle}>{t('childName')}</AppText>
              <AppInput
                value={name}
                onChangeText={setName}
                placeholder={t('childNamePlaceholder')}
                error={errors.name}
                autoFocus
                maxLength={30}
              />

              <AppText style={styles.sectionTitle}>{t('childBirthday')}</AppText>
              <CuteDatePicker
                value={birthDate}
                onChange={setBirthDate}
                placeholder={t('selectBirthday')}
              />
              {errors.birthDate && (
                <AppText style={styles.errorText}>{errors.birthDate}</AppText>
              )}
            </View>

            <View style={styles.buttonSection}>
              <AppButton
                variant="primary"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading || !name.trim()}
                style={styles.addButton}
              >
                {t('addChild')}
              </AppButton>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.error[500],
    marginTop: 4,
    marginLeft: 4,
  },
  buttonSection: {
    paddingBottom: 32,
  },
  addButton: {
    marginTop: 16,
  },
}); 