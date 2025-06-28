import React from "react";
import { Slot, Redirect } from "expo-router";
import { useAuth } from "@hooks/useAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
};

export default AppLayout;
