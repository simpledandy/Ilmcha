import { Image as ExpoImage, ImageProps as ExpoImageProps, ImageContentFit } from 'expo-image';
import React from 'react';

export type AppImageProps = ExpoImageProps & {
  // Optionally extend with custom props if needed
};

export function AppImage(props: AppImageProps) {
  const { ...otherProps } = props;
  

  return <ExpoImage {...otherProps} />;
} 