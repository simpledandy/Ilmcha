import { Dimensions } from 'react-native';
import i18n from '@/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TILE_SPREAD = 3; // 3 left, 3 right, 3 up, 3 down

const TILE_WIDTH = SCREEN_WIDTH;
const TILE_HEIGHT = SCREEN_WIDTH * 0.5105; // Maintain aspect ratio

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
    id: 'numbers',
    title: 'islandNumbersTitle',
    subtitle: 'islandNumbersSubtitle',
    x: MAP_WIDTH * 0.25,
    y: MAP_HEIGHT * 0.4,
    size: 'large',
    status: 'unlocked',
    imageSource: require('@assets/images/backgrounds/islands/numeriya.png'),
  },
  {
    id: 'alphabet',
    title: 'islandAlphabetTitle',
    subtitle: 'islandAlphabetSubtitle',
    x: MAP_WIDTH * 0.3,
    y: MAP_HEIGHT * 0.2,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/alifbo.png'),
  },
  {
    id: 'basics',
    title: 'islandBasicsTitle',
    subtitle: 'islandBasicsSubtitle',
    x: MAP_WIDTH * 0.7,
    y: MAP_HEIGHT * 0.3,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'colors',
    title: 'islandColorsTitle', 
    subtitle: 'islandColorsSubtitle',
    x: MAP_WIDTH * 0.3,
    y: MAP_HEIGHT * 0.6,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'shapes',
    title: 'islandShapesTitle',
    subtitle: 'islandShapesSubtitle',
    x: MAP_WIDTH * 0.6,
    y: MAP_HEIGHT * 0.7,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'family',
    title: 'islandFamilyTitle',
    subtitle: 'islandFamilySubtitle',
    x: MAP_WIDTH * 0.1,
    y: MAP_HEIGHT * 0.5,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'food',
    title: 'islandFoodTitle',
    subtitle: 'islandFoodSubtitle',
    x: MAP_WIDTH * 0.8,
    y: MAP_HEIGHT * 0.6,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'conversation',
    title: 'islandConversationTitle',
    subtitle: 'islandConversationSubtitle',
    x: MAP_WIDTH * 0.5,
    y: MAP_HEIGHT * 0.8,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
];