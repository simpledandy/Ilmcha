import { audioMap } from '@constants/audioMap';
import { Audio } from 'expo-av';
import i18n from 'i18next';

let currentSound: Audio.Sound | null = null;
let lastPlayedAudio: string | null = null;
let isNavigatingBack = false;

export function setNavigationState(isBack: boolean) {
  isNavigatingBack = isBack;
}

export async function playAudio(key: keyof typeof audioMap['en'], forcePlay = false) {
  try {
    // If we're navigating back and this isn't a forced play, don't play the audio
    if (isNavigatingBack && !forcePlay) {
      console.log('Skipping audio playback due to back navigation:', key);
      return;
    }

    // Don't replay the same audio unless forced
    if (lastPlayedAudio === key && !forcePlay) {
      console.log('Skipping duplicate audio playback:', key);
      return;
    }

    // Stop any currently playing audio
    if (currentSound) {
      try {
        const status = await currentSound.getStatusAsync();
        if (status.isLoaded) {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
        }
      } catch (error) {
        console.log('Error stopping previous audio:', error);
      }
      currentSound = null;
    }

    // Get the current language from i18n
    const lang = i18n.language;
    
    // Ensure we have the audio file for the current language
    if (!audioMap[lang]?.[key]) {
      console.log(`Audio not found for language ${lang} and key ${key}`);
      return;
    }

    // Create and load new sound
    const sound = new Audio.Sound();
    currentSound = sound;
    
    try {
      await sound.loadAsync(audioMap[lang][key]);
      
      // Set audio mode to play even in background
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      await sound.playAsync();
      lastPlayedAudio = key;
      console.log('Successfully playing audio:', key);
    } catch (error) {
      console.log('Error playing audio:', error);
      // Clean up the sound object if there was an error
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (cleanupError) {
          console.log('Error cleaning up sound after playback error:', cleanupError);
        }
      }
      currentSound = null;
    }
  } catch (error) {
    console.log('Error in playAudio:', error);
    currentSound = null;
  }
}

// Cleanup function to be called when component unmounts
export async function cleanupAudio() {
  if (currentSound) {
    try {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
    } catch (error) {
      console.log('Error cleaning up audio:', error);
    }
    currentSound = null;
  }
}
