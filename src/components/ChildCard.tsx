import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AppText } from './AppText';
import { AppImage } from './AppImage';
import { colors } from '@theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { ChildWithStats } from '../types/children';

interface ChildCardProps {
  child: ChildWithStats;
  isSelected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  isSelected,
  onPress,
  onLongPress,
}) => {
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getAvatarSource = () => {
    if (child.avatar_url) {
      return { uri: child.avatar_url };
    }
    // Default to boy avatar for now, could be randomized or based on child data
    return require('@assets/images/boy-avatar.png');
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <AppImage source={getAvatarSource()} style={styles.avatar} />
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <AppText style={styles.name} numberOfLines={1}>
          {child.name}
        </AppText>
        
        {child.date_of_birth && (
          <AppText style={styles.age}>
            {getAge(child.date_of_birth)} years old
          </AppText>
        )}
        
        {child.stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={12} color={colors.warning[500]} />
              <AppText style={styles.statText}>{child.stats.stars}</AppText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={12} color={colors.primary[500]} />
              <AppText style={styles.statText}>{child.stats.coins}</AppText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={12} color={colors.success[500]} />
              <AppText style={styles.statText}>{child.stats.total_xp}</AppText>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  selectedContainer: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
    transform: [{ scale: 1.05 }],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.border.light,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.common.white,
    borderRadius: 12,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  age: {
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statText: {
    fontSize: 10,
    color: colors.text.secondary,
    marginLeft: 2,
    fontWeight: '500',
  },
}); 