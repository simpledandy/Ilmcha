import { useAudio } from "@providers/AudioProvider";

// useAudioPlayer is now just a wrapper for useAudio from AudioProvider
export function useAudioPlayer() {
  return useAudio();
}
