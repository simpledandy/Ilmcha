import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TILE_SPREAD = 3; // 3 left, 3 right, 3 up, 3 down

const TILE_WIDTH = SCREEN_WIDTH;
const TILE_HEIGHT = SCREEN_HEIGHT * 0.5105;

const MAP_WIDTH = TILE_WIDTH * (TILE_SPREAD * 2 + 1);
const MAP_HEIGHT = TILE_HEIGHT * (TILE_SPREAD * 2 + 1);

export interface IslandData {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  status: 'locked' | 'unlocked' | 'completed';
  imageSource?: any;
}

export const islands: IslandData[] = [
  {
    id: 'basics',
    title: 'Salomlashish',
    subtitle: 'Greetings & Basics',
    x: MAP_WIDTH * 0.55,
    y: MAP_HEIGHT * 0.55,
    size: 'large',
    status: 'unlocked',
    imageSource: require('@assets/images/backgrounds/islands/numeriya.png'),
  },
  {
    id: 'numbers',
    title: 'Raqamlar',
    subtitle: 'Numbers',
    x: MAP_WIDTH * 0.6,
    y: MAP_HEIGHT * 0.50,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/alifbo.png'),
  },
  {
    id: 'family',
    title: 'Oila',
    subtitle: 'Family',
    x: MAP_WIDTH * 0.50,
    y: MAP_HEIGHT * 0.45,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'food',
    title: 'Taom',
    subtitle: 'Food & Drinks',
    x: MAP_WIDTH * 0.65,
    y: MAP_HEIGHT * 0.6,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'conversation',
    title: 'Suhbat',
    subtitle: 'Conversations',
    x: MAP_WIDTH * 0.45,
    y: MAP_HEIGHT * 0.6,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
]; 