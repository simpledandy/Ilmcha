import { useCallback, useEffect, useRef, useState } from 'react';
import { playAudio, cleanupAudio } from '../utils/audio';

interface AudioPlayerState {
  isPlaying: boolean;
  currentAudio: string | null;
  hasError: boolean;
  errorMessage: string | null;
}

interface UseAudioPlayerOptions {
  autoPlay?: boolean;
  onPlayStart?: (audioKey: string) => void;
  onPlayEnd?: (audioKey: string) => void;
  onError?: (error: string) => void;
}

export function useAudioPlayer(
  audioKey?: string, 
  options: UseAudioPlayerOptions = {}
) {
  const {
    autoPlay = true,
    onPlayStart,
    onPlayEnd,
    onError,
  } = options;

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentAudio: null,
    hasError: false,
    errorMessage: null,
  });

  const playedRef = useRef(false);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      cleanupAudio();
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (audioKey && autoPlay && !playedRef.current && mountedRef.current) {
      handlePlay(audioKey);
      playedRef.current = true;
    }
  }, [audioKey, autoPlay]);

  const handlePlay = useCallback(async (key: string, forcePlay = false) => {
    if (!mountedRef.current) return;

    try {
      setState(prev => ({
        ...prev,
        isPlaying: true,
        currentAudio: key,
        hasError: false,
        errorMessage: null,
      }));

      onPlayStart?.(key);
      
      await playAudio(key, forcePlay);
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isPlaying: false,
        }));
        onPlayEnd?.(key);
      }
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown audio error';
        setState(prev => ({
          ...prev,
          isPlaying: false,
          hasError: true,
          errorMessage,
        }));
        onError?.(errorMessage);
      }
    }
  }, [onPlayStart, onPlayEnd, onError]);

  const play = useCallback((key: string, forcePlay = false) => {
    handlePlay(key, forcePlay);
  }, [handlePlay]);

  const stop = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      await cleanupAudio();
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentAudio: null,
      }));
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to stop audio';
        setState(prev => ({
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
    });
    playedRef.current = false;
  }, []);

  return { 
    play,
    stop,
    reset,
    ...state,
  };
} 