import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Make the map 2x2 screens in size
export const MAP_WIDTH = SCREEN_WIDTH * 2;
export const MAP_HEIGHT = SCREEN_HEIGHT * 2;

export interface IslandData {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  status: 'locked' | 'unlocked' | 'completed';
}

export const islands: IslandData[] = [
  {
    id: 'basics',
    title: 'Salomlashish',
    subtitle: 'Greetings & Basics',
    x: MAP_WIDTH * 0.25,
    y: MAP_HEIGHT * 0.25,
    size: 'large',
    status: 'unlocked',
  },
  {
    id: 'numbers',
    title: 'Raqamlar',
    subtitle: 'Numbers',
    x: MAP_WIDTH * 0.6,
    y: MAP_HEIGHT * 0.3,
    size: 'medium',
    status: 'locked',
  },
  {
    id: 'family',
    title: 'Oila',
    subtitle: 'Family',
    x: MAP_WIDTH * 0.2,
    y: MAP_HEIGHT * 0.7,
    size: 'medium',
    status: 'locked',
  },
  {
    id: 'food',
    title: 'Taom',
    subtitle: 'Food & Drinks',
    x: MAP_WIDTH * 0.7,
    y: MAP_HEIGHT * 0.6,
    size: 'medium',
    status: 'locked',
  },
  {
    id: 'conversation',
    title: 'Suhbat',
    subtitle: 'Conversations',
    x: MAP_WIDTH * 0.8,
    y: MAP_HEIGHT * 0.8,
    size: 'large',
    status: 'locked',
  },
]; 