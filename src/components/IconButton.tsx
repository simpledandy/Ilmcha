import React from "react";
import { Pressable, PressableProps } from "react-native";
import { AppImage } from "./AppImage";

interface IconButtonProps extends PressableProps {
  icon: number;
}

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <Pressable {...props}>
      <AppImage source={props.icon} style={{ width: 40, height: 40 }} contentFit="contain" />
    </Pressable>
  );
};

