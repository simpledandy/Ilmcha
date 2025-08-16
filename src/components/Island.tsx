
import { colors } from '@theme/colors';
import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { AppImage } from './AppImage';
import { AppText } from './AppText';
import { useTranslation } from 'react-i18next';
import { BackgroundImages } from '../constants';

const sizeMap = {
  small: 80,
  medium: 120,
  large: 160,
};

interface IslandProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
  topicImage?: number;
  x?: number;
  y?: number;
}

export function Island(props: IslandProps) {
  const diameter = sizeMap[props.size || 'medium'];
  let nameColor = colors.text.primary;
  const { t } = useTranslation();
  return (
    <Pressable
      style={[
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          right: props.x,
          top: props.y,
        },
        props.style,
      ]}
      onPress={props.onPress}
    >
      <AppImage source={BackgroundImages.islandBg} style={{ position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' }} />
      <View style={{ justifyContent: 'center', position: 'absolute', top: diameter * 0.25, width: '100%', alignItems: 'center' }}>
      {
        props.topicImage && (
            <AppImage
              source={props.topicImage}
              style={{
                width: diameter * 0.5,
                height: diameter * 0.5,
                marginHorizontal: 4,
                marginBottom: 8,
                zIndex:  1,
              }}
              contentFit="contain"
            />
          )
      }
      </View>
      <AppText 
        weight="Bold" 
        style={{ 
          color: nameColor, 
          fontSize: 18, 
          position: 'absolute', 
          bottom: 10, 
          width: '100%', 
          textAlign: 'center',
          fontFamily: 'Fredoka-Bold',
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          letterSpacing: 0.5,
        }}
      >
        {t(`islandNames.${props.title}`, props.title)}
      </AppText>
    </Pressable>
  );
} 