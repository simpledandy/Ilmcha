import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { AnimatedStyle } from '@types/common';

export interface TreasureRewardModalProps {
  isVisible: boolean;
  modalAnimatedStyle: AnimatedStyle;
  children: React.ReactNode;
  onRequestClose: () => void;
}

export const TreasureRewardModal: React.FC<TreasureRewardModalProps> = ({ isVisible, modalAnimatedStyle, children, onRequestClose }) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="none"
    onRequestClose={onRequestClose}
  >
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, modalAnimatedStyle]}>
        {children}
      </Animated.View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
});

export { TreasureRewardModal }; 