import { audioMap } from '@constants/audioMap';
import * as Localization from 'expo-localization';
import { Audio } from 'expo-av';

export async function playAudio(key: keyof typeof audioMap['en']) {
  const lang = Localization.locale.startsWith('uz') ? 'uz' : 'en';
  const sound = new Audio.Sound();
  await sound.loadAsync(audioMap[lang][key]);
  await sound.playAsync();
}
