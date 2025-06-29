import { audioMap } from "../constants/audio/audioMap";
import { Audio } from "expo-av";
import i18n from "i18next";

class AudioManager {
  private static instance: AudioManager;
  private currentSound: Audio.Sound | null = null;
  private lastPlayedAudio: string | null = null;
  private isNavigatingBack = false;
  private audioQueue: string[] = [];
  private isPlaying = false;
  private lastPlayTimestamp = 0;
  private debounceMs = 100;
  private statusSubscribers: ((status: unknown) => void)[] = [];

  // Track navigation depth to determine when to play welcome audios
  private navigationDepth = 0;
  private welcomeAudioKeys = new Set(["welcomeTales"]);

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setNavigationState(isBack: boolean) {
    this.isNavigatingBack = isBack;
    if (isBack) {
      this.navigationDepth = Math.max(0, this.navigationDepth - 1);
    } else {
      this.navigationDepth++;
    }
  }

  async playAudio(
    key: keyof (typeof audioMap)["en"],
    forcePlay = false,
  ): Promise<void> {
    const now = Date.now();

    // Check if this is a welcome audio
    const isWelcomeAudio = this.welcomeAudioKeys.has(key);

    // For welcome audios, only play if we're not navigating back and we're at the appropriate depth
    if (isWelcomeAudio && !forcePlay) {
      // Don't play welcome audio if we're navigating back
      if (this.isNavigatingBack) {
        return;
      }

      // Don't play welcome audio if we're at a deeper navigation level
      // (meaning we came from a deeper screen, not from an earlier screen)
      if (this.navigationDepth > 1) {
        return;
      }
    }

    // Apply minimal debouncing only for non-welcome audios to prevent rapid-fire audio
    if (
      !isWelcomeAudio &&
      !forcePlay &&
      now - this.lastPlayTimestamp < this.debounceMs
    ) {
      return;
    }

    this.lastPlayTimestamp = now;

    try {
      // Don't replay the same audio unless forced
      if (this.lastPlayedAudio === key && !forcePlay) {
        return;
      }

      // Add to queue if already playing (but not for welcome audios)
      if (this.isPlaying && !forcePlay && !isWelcomeAudio) {
        this.audioQueue.push(key);
        return;
      }

      await this.stopCurrentAudio();
      await this.loadAndPlayAudio(key);
    } catch {
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
      } catch {
        try {
          await this.currentSound.unloadAsync();
        } catch {
          // Silent fail - already trying to cleanup
        }
      }
      this.currentSound = null;
    }
  }

  private async loadAndPlayAudio(
    key: keyof (typeof audioMap)["en"],
  ): Promise<void> {
    const lang = i18n.language;
    if (!Object.prototype.hasOwnProperty.call(audioMap, lang)) {
      return;
    }
    const typedLang = lang as keyof typeof audioMap;

    // Check if the requested audio exists, if not use "unavailable" as fallback
    let audioKey = key;
    if (!audioMap[typedLang]?.[key]) {
      audioKey = "unavailable" as keyof (typeof audioMap)["en"];
    }

    const sound = new Audio.Sound();
    this.currentSound = sound;
    this.isPlaying = true;

    try {
      await sound.loadAsync(
        audioMap[typedLang][audioKey] as import("expo-av").AVPlaybackSource,
      );

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      await sound.playAsync();
      this.lastPlayedAudio = key; // Keep the original key for logging

      // Notify that audio has started playing
      this.notifyStatusSubscribers({
        isLoaded: true,
        isPlaying: true,
        positionMillis: 0,
        durationMillis: 0,
      });

      // Wait for playback to finish and track progress
      await new Promise<void>((resolve) => {
        const onPlaybackStatusUpdate = (status: unknown) => {
          if (
            typeof status === "object" &&
            status !== null &&
            "didJustFinish" in status &&
            "isLoaded" in status
          ) {
            this.notifyStatusSubscribers(status);
            // Type assertion for safe property access
            const s = status as { didJustFinish: boolean; isLoaded: boolean };
            if (s.didJustFinish || s.isLoaded === false) {
              sound.setOnPlaybackStatusUpdate(null);
              resolve();
            }
          }
        };
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      });

      this.isPlaying = false;

      // Play next in queue if available
      if (this.audioQueue.length > 0) {
        const nextKey = this.audioQueue.shift();
        if (nextKey) {
          setTimeout(() => {
            void this.playAudio(nextKey as keyof (typeof audioMap)["en"]);
          }, 100);
        }
      }
    } catch {
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

  async playAudioSequence(
    keys: (keyof (typeof audioMap)["en"])[],
    debounce = true,
  ) {
    const now = Date.now();
    if (debounce && now - this.lastPlayTimestamp < this.debounceMs) {
      return;
    }
    this.lastPlayTimestamp = now;
    for (const key of keys) {
      await this.playAudio(key, true); // forcePlay = true to bypass debounce
    }
  }

  async pauseAudio() {
    if (this.currentSound) {
      try {
        await this.currentSound.pauseAsync();
        this.isPlaying = false;
      } catch {
        // Silent fail - audio might already be stopped
      }
    }
  }

  async resumeAudio() {
    if (this.currentSound) {
      try {
        await this.currentSound.playAsync();
        this.isPlaying = true;
      } catch {
        // Silent fail - audio might not be loaded
      }
    }
  }

  subscribeToStatus(subscriber: (status: unknown) => void) {
    this.statusSubscribers.push(subscriber);
    // Return unsubscribe function
    return () => {
      this.statusSubscribers = this.statusSubscribers.filter(
        (s) => s !== subscriber,
      );
    };
  }

  private notifyStatusSubscribers(status: unknown) {
    this.statusSubscribers.forEach((subscriber) => subscriber(status));
  }
}

const audioManager = AudioManager.getInstance();

export const setNavigationState = (isBack: boolean) =>
  audioManager.setNavigationState(isBack);
export const playAudio = (
  key: keyof (typeof audioMap)["en"],
  forcePlay = false,
) => audioManager.playAudio(key, forcePlay);
export const cleanupAudio = () => audioManager.cleanupAudio();
export const playAudioSequence = (
  keys: (keyof (typeof audioMap)["en"])[],
  debounce = true,
) => audioManager.playAudioSequence(keys, debounce);
export const pauseAudio = () => audioManager.pauseAudio();
export const resumeAudio = () => audioManager.resumeAudio();
export const subscribeToAudioStatus = (subscriber: (status: unknown) => void) =>
  audioManager.subscribeToStatus(subscriber);
