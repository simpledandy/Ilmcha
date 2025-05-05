import { Dimensions } from 'react-native';
import i18n from '@/i18n';

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
    id: 'numbers',
    title: 'islandNumbersTitle',
    subtitle: 'islandNumbersSubtitle',
    x: MAP_WIDTH * 0.6,
    y: MAP_HEIGHT * 0.50,
    size: 'large',
    status: 'unlocked',
    imageSource: require('@assets/images/backgrounds/islands/numeriya.png'),
  },
  {
    id: 'alphabet',
    title: 'islandAlphabetTitle',
    subtitle: 'islandAlphabetSubtitle',
    x: MAP_WIDTH * 0.65,
    y: MAP_HEIGHT * 0.45,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/alifbo.png'),
  },
  {
    id: 'basics',
    title: 'islandBasicsTitle',
    subtitle: 'islandBasicsSubtitle',
    x: MAP_WIDTH * 0.60,
    y: MAP_HEIGHT * 0.25,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'colors',
    title: 'islandColorsTitle', 
    subtitle: 'islandColorsSubtitle',
    x: MAP_WIDTH * 0.65,
    y: MAP_HEIGHT * 0.35,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'shapes',
    title: 'islandShapesTitle',
    subtitle: 'islandShapesSubtitle',
    x: MAP_WIDTH * 0.60,
    y: MAP_HEIGHT * 0.40,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'family',
    title: 'islandFamilyTitle',
    subtitle: 'islandFamilySubtitle',
    x: MAP_WIDTH * 0.50,
    y: MAP_HEIGHT * 0.45,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'food',
    title: 'islandFoodTitle',
    subtitle: 'islandFoodSubtitle',
    x: MAP_WIDTH * 0.65,
    y: MAP_HEIGHT * 0.6,
    size: 'medium',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
  {
    id: 'conversation',
    title: 'ilandConversationTitle',
    subtitle: 'islandConversationSubtitle',
    x: MAP_WIDTH * 0.45,
    y: MAP_HEIGHT * 0.6,
    size: 'large',
    status: 'locked',
    imageSource: require('@assets/images/backgrounds/islands/blank.png'),
  },
];