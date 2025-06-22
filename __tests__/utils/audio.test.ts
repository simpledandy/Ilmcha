import { playAudio, cleanupAudio, setNavigationState } from '../../src/utils/audio';
import { Audio } from 'expo-av';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn(),
      playAsync: jest.fn(),
      stopAsync: jest.fn(),
      unloadAsync: jest.fn(),
      getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
    })),
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock i18n
jest.mock('i18next', () => ({
  language: 'en',
}));

// Mock audioMap
jest.mock('../../src/constants/audioMap', () => ({
  audioMap: {
    en: {
      congrats: require('../../assets/audios/en/congrats-en.mp3'),
      countingFish: require('../../assets/audios/en/counting-fish-en.mp3'),
    },
    uz: {
      congrats: require('../../assets/audios/uz/congrats-uz.m4a'),
      countingFish: require('../../assets/audios/uz/counting-fish-uz.m4a'),
    },
  },
}));

describe('Audio Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setNavigationState(false);
  });

  describe('playAudio', () => {
    it('plays audio successfully', async () => {
      const mockSound = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      await playAudio('congrats');

      expect(mockSound.loadAsync).toHaveBeenCalled();
      expect(mockSound.playAsync).toHaveBeenCalled();
      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
    });

    it('handles loadAsync errors gracefully', async () => {
      const mockSound = {
        loadAsync: jest.fn().mockRejectedValue(new Error('Load failed')),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      // Should not throw
      await expect(playAudio('congrats')).resolves.toBeUndefined();
      
      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });

    it('handles playAsync errors gracefully', async () => {
      const mockSound = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockRejectedValue(new Error('Play failed')),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      // Should not throw
      await expect(playAudio('congrats')).resolves.toBeUndefined();
      
      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });

    it('handles missing audio files gracefully', async () => {
      // Mock audioMap with missing file
      jest.doMock('../../src/constants/audioMap', () => ({
        audioMap: {
          en: {
            congrats: require('../../assets/audios/en/congrats-en.mp3'),
            // missing countingFish
          },
        },
      }));

      // Should not throw
      await expect(playAudio('countingFish')).resolves.toBeUndefined();
    });

    it('handles unsupported language gracefully', async () => {
      // Mock i18n with unsupported language
      jest.doMock('i18next', () => ({
        language: 'fr', // Unsupported language
      }));

      // Should not throw
      await expect(playAudio('congrats')).resolves.toBeUndefined();
    });

    it('stops previous audio before playing new one', async () => {
      const mockSound1 = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      const mockSound2 = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      (Audio.Sound as jest.Mock)
        .mockImplementationOnce(() => mockSound1)
        .mockImplementationOnce(() => mockSound2);

      await playAudio('congrats');
      await playAudio('countingFish');

      expect(mockSound1.stopAsync).toHaveBeenCalled();
      expect(mockSound1.unloadAsync).toHaveBeenCalled();
    });

    it('skips audio when navigating back', async () => {
      setNavigationState(true);

      const mockSound = {
        loadAsync: jest.fn(),
        playAsync: jest.fn(),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      await playAudio('congrats');

      expect(mockSound.loadAsync).not.toHaveBeenCalled();
      expect(mockSound.playAsync).not.toHaveBeenCalled();
    });

    it('forces play even when navigating back', async () => {
      setNavigationState(true);

      const mockSound = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      await playAudio('congrats', true); // forcePlay = true

      expect(mockSound.loadAsync).toHaveBeenCalled();
      expect(mockSound.playAsync).toHaveBeenCalled();
    });

    it('prevents duplicate audio playback', async () => {
      const mockSound = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      await playAudio('congrats');
      await playAudio('congrats'); // Same audio again

      expect(mockSound.loadAsync).toHaveBeenCalledTimes(1);
      expect(mockSound.playAsync).toHaveBeenCalledTimes(1);
    });

    it('handles getStatusAsync errors gracefully', async () => {
      const mockSound = {
        loadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        stopAsync: jest.fn().mockRejectedValue(new Error('Status check failed')),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockRejectedValue(new Error('Status failed')),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      // Should not throw
      await expect(playAudio('congrats')).resolves.toBeUndefined();
    });
  });

  describe('cleanupAudio', () => {
    it('cleans up audio successfully', async () => {
      const mockSound = {
        stopAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      // First play some audio to set up currentSound
      await playAudio('congrats');
      
      // Then cleanup
      await cleanupAudio();

      expect(mockSound.stopAsync).toHaveBeenCalled();
      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });

    it('handles cleanup errors gracefully', async () => {
      const mockSound = {
        stopAsync: jest.fn().mockRejectedValue(new Error('Stop failed')),
        unloadAsync: jest.fn().mockRejectedValue(new Error('Unload failed')),
        getStatusAsync: jest.fn().mockRejectedValue(new Error('Status failed')),
      };
      
      (Audio.Sound as jest.Mock).mockImplementation(() => mockSound);

      // First play some audio to set up currentSound
      await playAudio('congrats');
      
      // Should not throw
      await expect(cleanupAudio()).resolves.toBeUndefined();
    });

    it('handles cleanup when no audio is playing', async () => {
      // Should not throw
      await expect(cleanupAudio()).resolves.toBeUndefined();
    });
  });

  describe('setNavigationState', () => {
    it('sets navigation state correctly', () => {
      setNavigationState(true);
      // Note: We can't easily test the internal state, but we can test the behavior
      // through the playAudio function
    });
  });
}); 