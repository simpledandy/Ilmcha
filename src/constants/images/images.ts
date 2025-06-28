// If you see TypeScript errors about missing module declarations for image files, add a global declaration file (e.g., images.d.ts) with:
// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.svg';
// This is required for static asset imports in React Native/Expo projects.

import icon from "@assets/images/icon.png";
import favicon from "@assets/images/favicon.png";
import adaptiveIcon from "@assets/images/adaptive-icon.png";
import splashIcon from "@assets/images/splash-icon.png";
import taleIcon from "@assets/images/tale-icon.png";
import lockIcon from "@assets/images/lock-icon.png";
import chest from "@assets/images/chest.png";
import chestOpen from "@assets/images/chest-open.png";
import light from "@assets/images/light.png";
import numberFive from "@assets/images/number-five.png";
import cloudLeft from "@assets/images/cloud-left.png";
import cloudRight from "@assets/images/cloud-right.png";
import countingBg from "@assets/images/counting_bg.png";
import boyAvatar from "@assets/images/boy-avatar.png";
import girlAvatar from "@assets/images/girl-avatar.png";
import addIcon from "@assets/images/add-icon.png";
import emptyAvatar from "@assets/images/empty-avatar.png";
import island from "@assets/images/island.png";
import storiesBg from "@assets/images/backgrounds/stories_bg.png";
import wavingPink from "@assets/images/penguin/waving-pink.png";
import wavingGray from "@assets/images/penguin/waving-gray.png";
import withLaptopPink from "@assets/images/penguin/with-laptop-questioning-pink.png";
import withLaptopGreen from "@assets/images/penguin/with-laptop-questioning-green.png";
import holdingPencilPink from "@assets/images/penguin/holding-pencil-pink.png";
import holdingPencilGreen from "@assets/images/penguin/holding-pencil-green.png";
import flyingOnPlane from "@assets/images/penguin/flying-open-eye-pink.png";
import wavingExplorer from "@assets/images/penguin/waving-explorer.png";
import numeriya from "@assets/images/backgrounds/islands/numeriya.png";
import alibo from "@assets/images/backgrounds/islands/alifbo.png";
import blank from "@assets/images/backgrounds/islands/blank.png";
import white from "@assets/images/backgrounds/auth/white.png";
import blue from "@assets/images/backgrounds/auth/blue.png";
import oceanBg from "@assets/images/backgrounds/ocean-bg.png";

export const AppIcons = {
  icon: icon as number,
  favicon: favicon as number,
  adaptiveIcon: adaptiveIcon as number,
  splashIcon: splashIcon as number,
  taleIcon: taleIcon as number,
  lockIcon: lockIcon as number,
  chest: chest as number,
  chestOpen: chestOpen as number,
  light: light as number,
  numberFive: numberFive as number,
  cloudLeft: cloudLeft as number,
  cloudRight: cloudRight as number,
  countingBg: countingBg as number,
  boyAvatar: boyAvatar as number,
  girlAvatar: girlAvatar as number,
  addIcon: addIcon as number,
  emptyAvatar: emptyAvatar as number,
  island: island as number,
  storiesBg: storiesBg as number,
};

// Penguin Character
export const PenguinImages = {
  poses: {
    wavingPink: wavingPink as number,
    wavingGray: wavingGray as number,
    withLaptopPink: withLaptopPink as number,
    withLaptopGreen: withLaptopGreen as number,
    holdingPencilPink: holdingPencilPink as number,
    holdingPencilGreen: holdingPencilGreen as number,
    flyingOnPlane: flyingOnPlane as number,
    wavingExplorer: wavingExplorer as number,
  },
  animations: {},
};

// Backgrounds and Decorations
export const BackgroundImages = {
  islands: {
    numeriya: numeriya as number,
    alibo: alibo as number,
    blank: blank as number,
  },
  decorations: {},
  auth: {
    white: white as number,
    blue: blue as number,
  },
  screens: {
    main: oceanBg as number,
  },
};
