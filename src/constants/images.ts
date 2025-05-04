export const AppIcons = {
  icon: require('@assets/images/icon.png'),
  favicon: require('@assets/images/favicon.png'),
  adaptiveIcon: require('@assets/images/adaptive-icon.png'),
  splashIcon: require('@assets/images/splash-icon.png'),
};

// Penguin Character
export const PenguinImages = {
  poses: {
    wavingPink: require('@assets/images/penguin/waving-pink.png'),
    wavingGray: require('@assets/images/penguin/waving-gray.png'),
    withLaptopPink: require('@assets/images/penguin/with-laptop-questioning-pink.png'),
    withLaptopGreen: require('@assets/images/penguin/with-laptop-questioning-green.png'),
    holdingPencilPink: require('@assets/images/penguin/holding-pencil-pink.png'),
    holdingPencilGreen: require('@assets/images/penguin/holding-pencil-green.png'),
    flyingOnPlane: require('@assets/images/penguin/flying-open-eye-pink.png'),

  },
  animations: {
    
  },
};

// Backgrounds and Decorations
export const BackgroundImages = {
  islands: {
    // Add your island backgrounds here as you add them
    // Example:
    // level1: require('../../assets/images/backgrounds/islands/level1.png'),
    numeriya: require('@assets/images/backgrounds/islands/numeriya.png'),
    alibo: require('@assets/images/backgrounds/islands/alifbo.png'),
    blank: require('@assets/images/backgrounds/islands/blank.png'),
  },
  decorations: {
    // Add your decorative elements here as you add them
    // Example:
    // clouds: require('../../assets/images/backgrounds/decorations/clouds.png'),
    // flowers: require('../../assets/images/backgrounds/decorations/flowers.png'),
  },
  auth: {
    // Add your auth images here as you add them
    // Example:
    // welcome: require('@assets/images/auth/welcome.png'),
    white: require('@assets/images/backgrounds/auth/white.png'),
    blue: require('@assets/images/backgrounds/auth/blue.png'),
  },
  screens: {
    main: require('@assets/images/backgrounds/ocean-bg.png')
  }
};


// Main export for easy imports
const Images = {
  app: AppIcons,
  penguin: PenguinImages,
  backgrounds: BackgroundImages,
};

export default Images;
