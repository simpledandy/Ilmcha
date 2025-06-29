import { useCallback, useEffect, useRef, useState } from "react";
import {
  playAudio,
  cleanupAudio,
  playAudioSequence,
  pauseAudio,
  resumeAudio,
  subscribeToAudioStatus,
} from "../utils/audio";
import { audioMap } from "../constants/audio/audioMap";

interface AudioPlayerState {
  isPlaying: boolean;
  currentAudio: string | null;
  hasError: boolean;
  errorMessage: string | null;
  isLoading: boolean;
  isPaused: boolean;
  positionMillis: number;
  durationMillis: number;
}

interface UseAudioPlayerOptions {
  autoPlay?: boolean;
  onPlayStart?: (audioKey: string) => void;
  onPlayEnd?: (audioKey: string) => void;
  onError?: (error: string) => void;
}

export function useAudioPlayer(
  audioKey?: string,
  options: UseAudioPlayerOptions = {},
) {
  const { autoPlay = true, onPlayStart, onPlayEnd, onError } = options;

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentAudio: null,
    hasError: false,
    errorMessage: null,
    isLoading: false,
    isPaused: false,
    positionMillis: 0,
    durationMillis: 0,
  });

  const playedRef = useRef(false);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      void cleanupAudio();
    };
  }, []);

  // Subscribe to audio status updates for progress
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
            isPaused: audioStatus.isLoaded
              ? !audioStatus.isPlaying && !audioStatus.didJustFinish
              : false,
          };

          // Handle audio completion
          if (audioStatus.didJustFinish && prev.isPlaying) {
            newState.isPlaying = false;
            newState.currentAudio = null;
            // Call onPlayEnd callback
            if (prev.currentAudio) {
              onPlayEnd?.(prev.currentAudio);
            }
          }

          return newState;
        });
      }
    });
    return unsubscribe;
  }, [onPlayEnd]);

  const handlePlay = useCallback(
    async (key: keyof (typeof audioMap)["en"], forcePlay = false) => {
      if (!mountedRef.current) return;

      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
        }));

        onPlayStart?.(key);

        await playAudio(key, forcePlay);

        // Set loading to false immediately after audio starts playing
        if (mountedRef.current) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isPlaying: true,
            currentAudio: key,
            hasError: false,
            errorMessage: null,
          }));
        }
      } catch (error) {
        if (mountedRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown audio error";
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isPlaying: false,
            hasError: true,
            errorMessage,
          }));
          onError?.(errorMessage);
        }
      }
    },
    [onPlayStart, onError],
  );

  // Auto-play effect
  useEffect(() => {
    if (audioKey && autoPlay && !playedRef.current && mountedRef.current) {
      void handlePlay(audioKey as keyof (typeof audioMap)["en"]);
      playedRef.current = true;
    }
  }, [audioKey, autoPlay, handlePlay]);

  const play = useCallback(
    (key: keyof (typeof audioMap)["en"], forcePlay = false) => {
      void handlePlay(key, forcePlay);
    },
    [handlePlay],
  );

  const stop = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      await cleanupAudio();
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        currentAudio: null,
      }));
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to stop audio";
        setState((prev) => ({
          ...prev,
          hasError: true,
          errorMessage,
        }));
        onError?.(errorMessage);
      }
    }
  }, [onError]);

  const reset = useCallback(() => {
    if (!mountedRef.current) return;

    setState({
      isPlaying: false,
      currentAudio: null,
      hasError: false,
      errorMessage: null,
      isLoading: false,
      isPaused: false,
      positionMillis: 0,
      durationMillis: 0,
    });
    playedRef.current = false;
  }, []);

  const pause = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      await pauseAudio();
      setState((prev) => ({
        ...prev,
        isPaused: true,
        isLoading: false,
      }));
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to pause audio";
        setState((prev) => ({
          ...prev,
          hasError: true,
          errorMessage,
          isLoading: false,
        }));
        onError?.(errorMessage);
      }
    }
  }, [onError]);

  const resume = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      await resumeAudio();

      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isPaused: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to resume audio";
        setState((prev) => ({
          ...prev,
          hasError: true,
          errorMessage,
          isLoading: false,
        }));
        onError?.(errorMessage);
      }
    }
  }, [onError]);

  return {
    play,
    stop,
    reset,
    pause,
    resume,
    ...state,
  };
}

/**
 * Plays the congrats sequence: 'congratsYouWon', the number (1-10), and 'coins' in sequence for the current language.
 * @param amount The number of coins (1-10)
 */
export async function playCongratsSequence(amount: number) {
  const numberKeys = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  const numberKey = numberKeys[amount - 1] as keyof (typeof audioMap)["en"];
  await playAudioSequence(["congratsYouWon", numberKey, "coins"]);
}
