import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '@theme/colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface CuteDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CuteDatePicker: React.FC<CuteDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select birthday',
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  const { t } = useTranslation();

  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShowPicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const renderPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel} style={styles.modalButton}>
                  <AppText style={styles.modalButtonText}>Cancel</AppText>
                </TouchableOpacity>
                <AppText style={styles.modalTitle}>Select Birthday</AppText>
                <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
                  <AppText style={styles.modalButtonText}>Done</AppText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                maximumDate={new Date()}
                minimumDate={new Date(2010, 0, 1)}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      );
    } else {
      return showPicker ? (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) onChange(date);
          }}
          maximumDate={new Date()}
          minimumDate={new Date(2010, 0, 1)}
        />
      ) : null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, disabled && styles.disabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <View style={styles.inputContent}>
          <Ionicons 
            name="calendar-outline" 
            size={24} 
            color={colors.primary[500]} 
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <AppText style={styles.dateText}>
              {value ? formatDate(value) : placeholder}
            </AppText>
            {value && (
              <AppText style={styles.ageText}>
                {getAge(value)} {t('yearsOld', { defaultValue: 'years old' })}
              </AppText>
            )}
          </View>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={colors.neutral[400]} 
          />
        </View>
      </TouchableOpacity>
      
      {renderPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  ageText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalButtonText: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: '500',
  },
  iosPicker: {
    width: width,
    height: 200,
  },
}); 