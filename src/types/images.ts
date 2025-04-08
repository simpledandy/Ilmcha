export interface AppIconsType {
  icon: number;
  favicon: number;
  adaptiveIcon: number;
  splashIcon: number;
}

export interface PenguinPosesType {
  welcomingPink: number;
  welcomingGray: number;
  registering: number;
  holdingPencil: number;
  flyingOnPlane: number;
}

export interface PenguinAnimationsType {
  // Will be added when animations are available
}

export interface PenguinImagesType {
  poses: PenguinPosesType;
  animations: PenguinAnimationsType;
}

export interface AuthImagesType {
  white: number;
  blue: number;
}

export interface IslandsType {
  numeriya: number;
  alibo: number;
  blank: number;
}

export interface ScreensType{
  main: number
}

export interface BackgroundImagesType {
  auth: AuthImagesType;
  islands: number;
  screens: ScreensType;
}

export interface ImagesType {
  app: AppIconsType;
  penguin: PenguinImagesType;
  backgrounds: BackgroundImagesType;
}
