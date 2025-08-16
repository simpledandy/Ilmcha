import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AudioProvider } from '@providers/AudioProvider';

export default function AppLayout() {
  return (
    <AudioProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </AudioProvider>
  );
}