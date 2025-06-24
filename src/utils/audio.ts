import { audioMap } from '../constants/audio/audioMap';
import { Audio } from 'expo-av';
import i18n from 'i18next';

class AudioManager {
  private static instance: AudioManager;
  private currentSound: Audio.Sound | null = null;
  private lastPlayedAudio: string | null = null;
  private isNavigatingBack = false;
  private audioQueue: string[] = [];
  private isPlaying = false;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setNavigationState(isBack: boolean) {
    this.isNavigatingBack = isBack;
  }

  async playAudio(key: keyof typeof audioMap['en'], forcePlay = false) {
    try {
      // If we're navigating back and this isn't a forced play, don't play the audio
      if (this.isNavigatingBack && !forcePlay) {
        if (__DEV__) {
          console.log('Skipping audio playback due to back navigation:', key);
        }
        return;
      }

      // Don't replay the same audio unless forced
      if (this.lastPlayedAudio === key && !forcePlay) {
        if (__DEV__) {
          console.log('Skipping duplicate audio playback:', key);
        }
        return;
      }

      // Add to queue if already playing
      if (this.isPlaying && !forcePlay) {
        this.audioQueue.push(key);
        return;
      }

      await this.stopCurrentAudio();
      await this.loadAndPlayAudio(key);
    } catch (error) {
      if (__DEV__) {
        console.error('Error in playAudio:', error);
      }
      await this.cleanupAudio();
    }
  }

  private async stopCurrentAudio() {
    if (this.currentSound) {
      try {
        const status = await this.currentSound.getStatusAsync();
        if (status.isLoaded) {
          await this.currentSound.stopAsync();
          await this.currentSound.unloadAsync();
        } else {
          await this.currentSound.unloadAsync();
        }
      } catch (error) {
        try {
          await this.currentSound.unloadAsync();
        } catch (cleanupError) {
          if (__DEV__) {
            console.log('Error cleaning up sound after stop error:', cleanupError);
          }
        }
        if (__DEV__) {
          console.log('Error stopping previous audio:', error);
        }
      }
      this.currentSound = null;
    }
  }

  private async loadAndPlayAudio(key: keyof typeof audioMap['en']) {
    const lang = i18n.language;
    
    if (!audioMap[lang]?.[key]) {
      if (__DEV__) {
        console.log(`Audio not found for language ${lang} and key ${key}`);
      }
      return;
    }

    const sound = new Audio.Sound();
    this.currentSound = sound;
    this.isPlaying = true;
    
    try {
      await sound.loadAsync(audioMap[lang][key]);
      
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      await sound.playAsync();
      this.lastPlayedAudio = key;
      this.isPlaying = false;
      
      if (__DEV__) {
        console.log('Successfully playing audio:', key);
      }

      // Play next in queue if available
      if (this.audioQueue.length > 0) {
        const nextKey = this.audioQueue.shift();
        if (nextKey) {
          setTimeout(() => this.playAudio(nextKey as keyof typeof audioMap['en']), 100);
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error playing audio:', error);
      }
      await this.cleanupAudio();
    }
  }

  async cleanupAudio() {
    await this.stopCurrentAudio();
    this.audioQueue = [];
    this.isPlaying = false;
  }

  getCurrentAudioKey(): string | null {
    return this.lastPlayedAudio;
  }

  isAudioPlaying(): boolean {
    return this.isPlaying;
  }
}

const audioManager = AudioManager.getInstance();

export const setNavigationState = (isBack: boolean) => audioManager.setNavigationState(isBack);
export const playAudio = (key: keyof typeof audioMap['en'], forcePlay = false) => audioManager.playAudio(key, forcePlay);
export const cleanupAudio = () => audioManager.cleanupAudio();
