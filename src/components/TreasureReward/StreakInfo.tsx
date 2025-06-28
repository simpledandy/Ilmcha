import React from "react";
import Animated from "react-native-reanimated";
import { Text } from "@components/Text";
import { colors } from "@theme/colors";
import { AnimatedStyle } from "@/src/types/common";

export interface StreakInfoProps {
  streak: number;
  animatedStyle: AnimatedStyle;
  label: string;
  daysLabel: string;
}

export const StreakInfo: React.FC<StreakInfoProps> = ({
  streak,
  animatedStyle,
  label,
  daysLabel,
}) => (
  <Animated.View
    style={[{ alignItems: "center", marginVertical: 4 }, animatedStyle]}
  >
    <Text variant="body" style={{ color: colors.warning[500] }}>
      🔥 {label}: {streak} {daysLabel}
    </Text>
  </Animated.View>
);
