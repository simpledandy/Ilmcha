// components/TaleCard.js
import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { AppText } from './AppText';
import { AppImage } from './AppImage';

interface TaleCardProps {
  imageSource: ImageSourcePropType;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const TaleCard: React.FC<TaleCardProps> = ({
  imageSource,
  title,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      testID="tale-card"
    >
      <AppImage source={imageSource} style={styles.image} contentFit="cover" />
      <AppText variant="heading3" style={styles.title}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 12,
  },
  title: {
    marginTop: 5,
    color: "#fff",
    backgroundColor: "#00c853",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    textAlign: "center",
  },
});
