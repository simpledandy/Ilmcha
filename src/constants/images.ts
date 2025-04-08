export const AppIcons = {
  icon: require('@assets/images/icon.png'),
  favicon: require('@assets/images/favicon.png'),
  adaptiveIcon: require('@assets/images/adaptive-icon.png'),
  splashIcon: require('@assets/images/splash-icon.png'),
};

// Penguin Character
export const PenguinImages = {
  poses: {
    // Add your penguin poses here as you add them
    // Example:
    // standing: require('../../assets/images/penguin/poses/standing.png'),
    welcomingPink: require('@assets/images/penguin/poses/welcoming-pink.png'),
    welcomingGray: require('@assets/images/penguin/poses/welcoming-gray.png'),
    registering: require('@assets/images/penguin/poses/registering.png'),
    holdingPencil: require('@assets/images/penguin/poses/holding-pencil.png'),
    flyingOnPlane: require('@assets/images/penguin/poses/flying-on-plane.png'),
  },
  animations: {
    // Add your penguin animations here as you add them
    // Example:
    // walking: require('../../assets/images/penguin/animations/walking.png'),
    // jumping: require('../../assets/images/penguin/animations/jumping.png'),
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
    main: require('@assets/images/backgrounds/main-bg.png')
  }
};


// Main export for easy imports
const Images = {
  app: AppIcons,
  penguin: PenguinImages,
  backgrounds: BackgroundImages,
};

export default Images;
