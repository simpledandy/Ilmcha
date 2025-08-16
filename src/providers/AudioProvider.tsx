import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import {
  playAudio,
  cleanupAudio,
  pauseAudio,
  resumeAudio,
  playAudioSequence,
  subscribeToAudioStatus,
} from "../utils/audio";

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isCompleted: boolean;
  currentAudio: string | null;
  positionMillis: number;
  durationMillis: number;
  hasError: boolean;
  errorMessage: string | null;
}

interface AudioContextType extends AudioState {
  play: (audioKey: Parameters<typeof playAudio>[0], forcePlay?: boolean) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  playSequence: (audioKeys: Parameters<typeof playAudioSequence>[0]) => void;
  reset: () => void;
}

const defaultState: AudioState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  isCompleted: false,
  currentAudio: null,
  positionMillis: 0,
  durationMillis: 0,
  hasError: false,
  errorMessage: null,
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AudioState>(defaultState);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void cleanupAudio();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAudioStatus((status: unknown) => {
      if (
        typeof status === "object" &&
        status !== null &&
        "positionMillis" in status
      ) {
        const audioStatus = status as {
          positionMillis?: number;
          durationMillis?: number;
          isLoaded?: boolean;
          isPlaying?: boolean;
          didJustFinish?: boolean;
        };
        setState((prev) => {
          const newState = {
            ...prev,
            positionMillis: audioStatus.positionMillis || 0,
            durationMillis: audioStatus.durationMillis || 0,
          };
          if (audioStatus.didJustFinish && prev.isPlaying) {
            newState.isPlaying = false;
            newState.isPaused = false;
            newState.isCompleted = true;
            newState.currentAudio = null;
          } else if (audioStatus.isLoaded !== undefined) {
            newState.isPlaying = audioStatus.isPlaying || false;
            newState.isPaused =
              audioStatus.isLoaded &&
              !audioStatus.isPlaying &&
              !audioStatus.didJustFinish;
            if (audioStatus.isPlaying || newState.isPaused) {
              newState.isCompleted = false;
            }
          }
          return newState;
        });
      }
    });
    return unsubscribe;
  }, []);

  const play = useCallback((audioKey: Parameters<typeof playAudio>[0], forcePlay = false) => {
    if (!mountedRef.current) return;
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isPaused: false,
      isCompleted: false,
      hasError: false,
      errorMessage: null,
      currentAudio: audioKey,
    }));
    playAudio(audioKey, forcePlay).catch((error) => {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isPlaying: false,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : "Failed to play audio",
        }));
      }
    });
  }, []);

  const stop = useCallback(() => {
    if (!mountedRef.current) return;
    cleanupAudio().then(() => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isCompleted: false,
        currentAudio: null,
      }));
    });
  }, []);

  const pause = useCallback(() => {
    if (!mountedRef.current) return;
    pauseAudio().then(() => {
      setState((prev) => ({
        ...prev,
        isPaused: true,
        isPlaying: false,
        isLoading: false,
      }));
    }).catch((error) => {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : "Failed to pause audio",
        }));
      }
    });
  }, []);

  const resume = useCallback(() => {
    if (!mountedRef.current) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    resumeAudio().then(() => {
      setState((prev) => ({
        ...prev,
        isPaused: false,
        isPlaying: true,
        isLoading: false,
      }));
    }).catch((error) => {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : "Failed to resume audio",
        }));
      }
    });
  }, []);

  const playSequence = useCallback((audioKeys: Parameters<typeof playAudioSequence>[0]) => {
    if (!mountedRef.current) return;
    setState((prev) => ({ ...prev, isLoading: true }));
    playAudioSequence(audioKeys, true).catch((error) => {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : "Failed to play sequence",
        }));
      }
    });
  }, []);

  const reset = useCallback(() => {
    if (!mountedRef.current) return;
    setState(defaultState);
  }, []);

  const value: AudioContextType = {
    ...state,
    play,
    stop,
    pause,
    resume,
    playSequence,
    reset,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
