import { audioMap } from '@constants/audioMap';
import { Audio } from 'expo-av';
import i18n from 'i18next';

let currentSound: Audio.Sound | null = null;

export async function playAudio(key: keyof typeof audioMap['en']) {
  // Stop any currently playing audio
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (error) {
      console.log('Error stopping previous audio:', error);
    }
  }

  // Get the current language from i18n
  const lang = i18n.language;
  
  try {
    // Create and load new sound
    currentSound = new Audio.Sound();
    await currentSound.loadAsync(audioMap[lang][key]);
    await currentSound.playAsync();
  } catch (error) {
    console.log('Error playing audio:', error);
    // If there's an error, try to play the English version as fallback
    if (lang === 'uz') {
      try {
        currentSound = new Audio.Sound();
        await currentSound.loadAsync(audioMap['en'][key]);
        await currentSound.playAsync();
      } catch (fallbackError) {
        console.log('Error playing fallback audio:', fallbackError);
      }
    }
  }
}

// Function to stop current audio
export async function stopAudio() {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  }
}
