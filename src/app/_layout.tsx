import React from "react";
import "react-native-gesture-handler";
import { Slot, usePathname, useRootNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { AuthProvider } from "@providers/AuthProvider";
import { SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, AppState } from "react-native";
import { setNavigationState, cleanupAudio } from "@utils/audio";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { initializeErrorReporting } from "@utils/errorReporting";
import SonoRegular from "@assets/fonts/Sono-Regular.ttf";
import SonoLight from "@assets/fonts/Sono-Light.ttf";
import SonoExtraLight from "@assets/fonts/Sono-ExtraLight.ttf";
import SonoMedium from "@assets/fonts/Sono-Medium.ttf";
import SonoSemiBold from "@assets/fonts/Sono-SemiBold.ttf";
import SonoBold from "@assets/fonts/Sono-Bold.ttf";
import SonoExtraBold from "@assets/fonts/Sono-ExtraBold.ttf";
import SonoProportionalRegular from "@assets/fonts/Sono_Proportional-Regular.ttf";
import SonoProportionalLight from "@assets/fonts/Sono_Proportional-Light.ttf";
import SonoProportionalExtraLight from "@assets/fonts/Sono_Proportional-ExtraLight.ttf";
import SonoProportionalMedium from "@assets/fonts/Sono_Proportional-Medium.ttf";
import SonoProportionalSemiBold from "@assets/fonts/Sono_Proportional-SemiBold.ttf";
import SonoProportionalBold from "@assets/fonts/Sono_Proportional-Bold.ttf";
import SonoProportionalExtraBold from "@assets/fonts/Sono_Proportional-ExtraBold.ttf";

// If you see TypeScript errors about missing module declarations for font files, add a global declaration file (e.g., fonts.d.ts) with:
// declare module '*.ttf';
// This is required for static asset imports in React Native/Expo projects.

// Prevent splash screen from auto-hiding
void SplashScreen.preventAutoHideAsync();

// Initialize error reporting
initializeErrorReporting();

export const RootLayout: React.FC = () => {
  const pathname = usePathname();
  const rootNavigation = useRootNavigation();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "Sono-Regular": SonoRegular,
    "Sono-Light": SonoLight,
    "Sono-ExtraLight": SonoExtraLight,
    "Sono-Medium": SonoMedium,
    "Sono-SemiBold": SonoSemiBold,
    "Sono-Bold": SonoBold,
    "Sono-ExtraBold": SonoExtraBold,
    "Sono_Proportional-Regular": SonoProportionalRegular,
    "Sono_Proportional-Light": SonoProportionalLight,
    "Sono_Proportional-ExtraLight": SonoProportionalExtraLight,
    "Sono_Proportional-Medium": SonoProportionalMedium,
    "Sono_Proportional-SemiBold": SonoProportionalSemiBold,
    "Sono_Proportional-Bold": SonoProportionalBold,
    "Sono_Proportional-ExtraBold": SonoProportionalExtraBold,
  });

  const [navigationReady, setNavigationReady] = useState(false);
  useEffect(() => {
    if (fontsLoaded) {
      setNavigationReady(true);
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (previousPath) {
      // Check if we're navigating back by comparing path segments
      const currentSegments = pathname.split("/").filter(Boolean);
      const previousSegments = previousPath.split("/").filter(Boolean);

      // If current path has fewer segments than previous, we're going back
      const isBack = currentSegments.length < previousSegments.length;

      // Special case: if we're going back to root ('/'), it's always a back navigation
      if (pathname === "/") {
        setNavigationState(false);
      } else {
        setNavigationState(isBack);
      }
    }
    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        setNavigationState(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!rootNavigation) return;
    // @ts-expect-error: 'beforeRemove' is a valid event for React Navigation
    const unsubscribe = rootNavigation.addListener?.("beforeRemove", () => {
      void cleanupAudio();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [rootNavigation]);

  if (!fontsLoaded || !navigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider navigationReady={navigationReady}>
          <Slot />
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default RootLayout;
