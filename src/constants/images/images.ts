// If you see TypeScript errors about missing module declarations for image files, add a global declaration file (e.g., images.d.ts) with:
// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.svg';

import taleIcon from "@assets/images/tale-icon.png";
import lockIcon from "@assets/images/lock-icon.png";
import chest from "@assets/images/chest.png";
import chestOpen from "@assets/images/chest-open.png";
import light from "@assets/images/light.png";
import cloudLeft from "@assets/images/cloud-left.png";
import cloudRight from "@assets/images/cloud-right.png";
import boyAvatar from "@assets/images/boy-avatar.png";
import girlAvatar from "@assets/images/girl-avatar.png";
import addIcon from "@assets/images/add-icon.png";
import emptyAvatar from "@assets/images/empty-avatar.png";
import storiesBg from "@assets/images/backgrounds/stories_bg.png";
import wavingPink from "@assets/images/penguin/waving-pink.png";
import wavingGray from "@assets/images/penguin/waving-gray.png";
import withLaptopPink from "@assets/images/penguin/with-laptop-questioning-pink.png";
import withLaptopGreen from "@assets/images/penguin/with-laptop-questioning-green.png";
import holdingPencilPink from "@assets/images/penguin/holding-pencil-pink.png";
import holdingPencilGreen from "@assets/images/penguin/holding-pencil-green.png";
import flyingOnPlane from "@assets/images/penguin/flying-open-eye-pink.png";
import wavingExplorer from "@assets/images/penguin/waving-explorer.png";
import white from "@assets/images/backgrounds/auth/white.png";
import blue from "@assets/images/backgrounds/auth/blue.png";
import oceanBg from "@assets/images/background/ocean-bg.png";
import islandBg from "@assets/images/background/island.png";

// topic images
import timeImage from "@assets/images/backgrounds/islands/time.png";
import colorsImage from "@assets/images/backgrounds/islands/colors.png";

// Adventure Island Backgrounds
import numeriyaAdventureBg from "@assets/images/backgrounds/islands/adventure/numeriya-island-bg.png";
import alifboAdventureBg from "@assets/images/backgrounds/islands/adventure/alifbo-island-bg.png";
import basicsAdventureBg from "@assets/images/backgrounds/islands/adventure/basics-island-bg.png";
import colorsAdventureBg from "@assets/images/backgrounds/islands/adventure/colors-island-bg.png";
import shapesAdventureBg from "@assets/images/backgrounds/islands/adventure/shapes-island-bg.png";
import familyAdventureBg from "@assets/images/backgrounds/islands/adventure/family-island-bg.png";
import foodAdventureBg from "@assets/images/backgrounds/islands/adventure/food-island-bg.png";
import conversationAdventureBg from "@assets/images/backgrounds/islands/adventure/conversation-island-bg.png";
import defaultAdventureBg from "@assets/images/backgrounds/islands/adventure/default-island-bg.png";

// Adventure Node Backgrounds
import lessonNode from "@assets/images/backgrounds/islands/adventure/lesson-node.png";
import lakeNode from "@assets/images/backgrounds/islands/adventure/lake-node.png";
import caveNode from "@assets/images/backgrounds/islands/adventure/cave-node.png";
import forestNode from "@assets/images/backgrounds/islands/adventure/forest-node.png";
import gardenNode from "@assets/images/backgrounds/islands/adventure/garden-node.png";
import yardNode from "@assets/images/backgrounds/islands/adventure/yard-node.png";
import castleNode from "@assets/images/backgrounds/islands/adventure/castle-node.png";
import beachNode from "@assets/images/backgrounds/islands/adventure/beach-node.png";
import mountainNode from "@assets/images/backgrounds/islands/adventure/mountain-node.png";

import pathStart from "@assets/images/background/path-start.png";
import pathMiddle from "@assets/images/background/path-middle.png";
import pathEnd from "@assets/images/background/path-end.png";
import { numbers } from "./numbers";
import { letters } from "./letters";
import { shapes } from "./shapes";

export const AppIcons = {
  taleIcon: taleIcon,
  lockIcon: lockIcon,
  chestIcon: chest,
  chestOpen: chestOpen,
  light: light,
  cloudLeft: cloudLeft,
  cloudRight: cloudRight,
  boyAvatar: boyAvatar,
  girlAvatar: girlAvatar,
  addIcon: addIcon,
  emptyAvatar: emptyAvatar,
  storiesBg: storiesBg,
};

// Penguin Character
export const PenguinImages = {
  poses: {
    wavingPink: wavingPink,
    wavingGray: wavingGray,
    withLaptopPink: withLaptopPink,
    withLaptopGreen: withLaptopGreen,
    holdingPencilPink: holdingPencilPink,
    holdingPencilGreen: holdingPencilGreen,
    flyingOnPlane: flyingOnPlane,
    wavingExplorer: wavingExplorer,
  },
  animations: {},
};

// Backgrounds and Decorations
export const BackgroundImages = {
  islands: {
    numbers,
    letters,
    shapes,
  },
  decorations: {
    time: timeImage,
    colors: colorsImage,
  },
  auth: {
    white: white,
    blue: blue,
  },
  oceanBg: oceanBg,
  islandBg: islandBg,
  adventure: {
    nodes: {
      lesson: lessonNode,
      lake: lakeNode,
      cave: caveNode,
      forest: forestNode,
      garden: gardenNode,
      yard: yardNode,
      castle: castleNode,
      beach: beachNode,
      mountain: mountainNode,
    },
  },
};

export const IslandPathImages = {
  start: pathStart,
  middle: pathMiddle,
  end: pathEnd,
};
