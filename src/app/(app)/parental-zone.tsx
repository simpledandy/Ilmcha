import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { AppImage } from '@components/AppImage';
import { ChildCard } from '@components/ChildCard';
import { AddChildModal } from '@components/AddChildModal';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useChildren } from '@hooks/useChildren';
import { colors } from '@theme/colors';
import type { ChildWithStats, AddChildData } from '../../types/children';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 120;
const SPACING = 16;

export default function ParentalZoneScreen() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { children, loading, error, addChild } = useChildren();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING));
    setSelectedIndex(Math.min(index, children.length));
  };

  const handleChildPress = (index: number) => {
    setSelectedIndex(index);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const handleAddChild = async (childData: AddChildData): Promise<{ success: boolean; error?: string }> => {
    setAddingChild(true);
    try {
      const result = await addChild(childData);
      if (result.success) {
        setShowAddModal(false);
        // Select the newly added child
        setSelectedIndex(0);
      }
      return result;
    } catch (error) {
      console.error('Error adding child:', error);
      const errorResult = { success: false, error: t('addChildError') };
      Alert.alert(t('error'), t('addChildError'));
      return errorResult;
    } finally {
      setAddingChild(false);
    }
  };

  const handleReportsPress = () => {
    if (children.length === 0) {
      Alert.alert(t('error'), t('noChildren'));
      return;
    }
    const selectedChild = children[selectedIndex];
    router.push({ pathname: '/reports', params: { childId: selectedChild.id } });
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  const renderChildCard = ({ item, index }: { item: ChildWithStats; index: number }) => (
    <ChildCard
      child={item}
      isSelected={index === selectedIndex}
      onPress={() => handleChildPress(index)}
    />
  );

  const renderAddButton = () => (
    <TouchableOpacity
      style={[styles.addButton, selectedIndex === children.length && styles.selectedAddButton]}
      onPress={() => setShowAddModal(true)}
      activeOpacity={0.8}
    >
      <View style={styles.addButtonContent}>
        <Ionicons name="add-circle" size={48} color={colors.primary[400]} />
        <AppText style={styles.addButtonText}>{t('addChild')}</AppText>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <AppText style={styles.loadingText}>{t('loading')}</AppText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error[500]} />
          <AppText style={styles.errorText}>{error}</AppText>
          <AppButton variant="primary" onPress={() => window.location.reload()}>
            {t('tryAgain')}
          </AppButton>
        </View>
      );
    }

    if (children.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={colors.neutral[400]} />
          <AppText style={styles.emptyTitle}>{t('noChildren')}</AppText>
          <AppText style={styles.emptySubtitle}>{t('addFirstChild')}</AppText>
          <AppButton variant="primary" onPress={() => setShowAddModal(true)} style={styles.addFirstButton}>
            {t('addChild')}
          </AppButton>
        </View>
      );
    }

    return (
      <View style={styles.swiperContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={[...children, { id: 'add', isAddButton: true }]}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.flatListContent}
            onScroll={handleScroll}
            renderItem={({ item, index }) => {
              if ('isAddButton' in item) {
                return renderAddButton();
              }
              return renderChildCard({ item: item as ChildWithStats, index });
            }}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppImage source={require('@assets/images/backgrounds/auth/white.png')} style={styles.bgTop} />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fef0e1" />
        </TouchableOpacity>
        <AppText variant="heading1" weight="Bold" style={styles.title}>
          {t('parentalZoneTitle')}
        </AppText>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#fef0e1" />
        </TouchableOpacity>
      </View>

      {renderContent()}

      {children.length > 0 && (
        <View style={styles.buttonsContainer}>
          <AppButton variant="secondary" onPress={handleReportsPress}>{t('reports')}</AppButton>
          <AppButton variant="secondary">{t('blockFunctions')}</AppButton>
          <AppButton variant="secondary">{t('screenTime')}</AppButton>
          <AppButton variant="secondary">{t('otherDevices')}</AppButton>
          <AppButton variant="secondary" onPress={handleLogout}>{t('logout')}</AppButton>
        </View>
      )}

      <AppImage source={require('@assets/images/cloud-left.png')} style={styles.cloudLeft} />
      <AppImage source={require('@assets/images/cloud-right.png')} style={styles.cloudRight} />

      <AddChildModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddChild={handleAddChild}
        loading={addingChild}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d99ed',
    alignItems: 'center',
    paddingTop: 50,
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    contentFit: 'cover',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fef0e1',
  },
  swiperContainer: {
    height: 160,
    marginBottom: 40,
    backgroundColor: '#fef0e1',
    borderColor: '#1d99ed',
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  addButton: {
    width: ITEM_WIDTH,
    height: 140,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    marginHorizontal: SPACING / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  selectedAddButton: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
    transform: [{ scale: 1.05 }],
  },
  addButtonContent: {
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef0e1',
    borderRadius: 20,
    marginBottom: 40,
    width: '90%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef0e1',
    borderRadius: 20,
    marginBottom: 40,
    width: '90%',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef0e1',
    borderRadius: 20,
    marginBottom: 40,
    width: '90%',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    minWidth: 150,
  },
  buttonsContainer: {
    width: '85%',
    gap: 12,
  },
  cloudLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.4,
    contentFit: 'contain',
  },
  cloudRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.4,
    contentFit: 'contain',
  },
});
