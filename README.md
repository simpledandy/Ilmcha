# Ilmcha Educational App

Ilmcha is a child-friendly educational app designed to make learning letters, numbers, and basic skills fun and interactive. It features tracing activities, a pirate-themed treasure reward system, and robust error handling to ensure a smooth experience for young learners.

---

## 🚀 Key Features

### ✏️ Tracing Activities
- **Finger-based tracing** for numbers and letters (English & Uzbek)
- **Real-time feedback**: Animated progress, accuracy scoring, and completion celebrations
- **Multi-stroke support**: Natural writing experience for complex shapes
- **Guided tracing**: Optional dotted lines and penguin guide
- **Audio & haptic feedback** for engagement

### 🏴‍☠️ Treasure Reward System
- **Collect treasures** of varying rarity (Common to Legendary)
- **Achievements & badges** for milestones in tracing, counting, and exploration
- **Daily streaks**: Bonus rewards for consistent learning
- **Animated reward modals** and sound effects

### 🛡️ Robustness & Quality
- **Comprehensive testing**: Unit, integration, and E2E tests
- **Enhanced error boundaries**: User-friendly error messages and recovery
- **Performance monitoring**: Optimized rendering and memory management
- **Accessibility**: Large touch targets, high contrast, and audio cues

---

## 📁 Project Structure & Conventions

### Directory Organization
```
src/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication routes
│   ├── (app)/             # Main app routes
│   ├── tale/              # Story/tale routes
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── components/            # Reusable UI components
│   ├── [ComponentName]/   # Component with sub-components
│   │   ├── index.ts       # Barrel exports
│   │   └── [SubComponent].tsx
│   └── [ComponentName].tsx
├── constants/             # Static data and configurations
│   ├── audio/             # Audio file mappings
│   ├── images/            # Image asset mappings
│   ├── lessons/           # Lesson definitions
│   ├── map/               # Map/island data
│   ├── rewards/           # Treasure/achievement data
│   ├── tales/             # Story content
│   └── tracing/           # Tracing path data
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
├── theme/                 # Design system
│   ├── __tests__/         # Theme tests
│   ├── colors.ts          # Color definitions
│   ├── input.ts           # Input styling
│   └── typography.ts      # Typography system
├── utils/                 # Utility functions
│   ├── __tests__/         # Utility tests
│   └── [utility].ts
└── types/                 # TypeScript type definitions (if needed)
```

### File Naming Conventions

#### Components
- **PascalCase** for component files: `Button.tsx`, `TreasureReward.tsx`
- **PascalCase** for component folders: `TreasureCollection/`, `UniversalLesson/`
- **camelCase** for utility files: `audio.ts`, `storage.ts`
- **kebab-case** for route files: `[island].tsx`, `[lesson].tsx`

#### Exports
- **Named exports** for components: `export const Button: React.FC<ButtonProps>`
- **Default exports** for app routes: `export default function HomeScreen()`
- **Barrel exports** in `index.ts` files for component groups

---

## 🎨 Component Conventions

### Component Structure
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { textStyles } from '@theme/typography';

interface ComponentProps {
  // Props definition
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2,
  ...props 
}) => {
  // Component logic
  
  return (
    <View style={[styles.container, props.style]}>
      {/* JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

### Component Guidelines
1. **Use React.FC** for component type annotations
2. **Named exports** for reusable components
3. **Default exports** only for app routes and main components
4. **Interface naming**: `ComponentNameProps`
5. **Style organization**: Use StyleSheet.create at the bottom
6. **Theme integration**: Import from `@theme/*` paths
7. **Props spreading**: Use `...props` for additional props

### Component Organization
- **Simple components**: Single file with component and styles
- **Complex components**: Folder with sub-components and `index.ts`
- **Component groups**: Use barrel exports in `index.ts`

---

## 🎯 TypeScript Conventions

### Type Definitions
```typescript
// Interface naming
interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

// Type exports
export type Colors = typeof colors;
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
```

### Type Guidelines
1. **Avoid `any`** - Use proper types or `unknown`
2. **Union types** for variants: `'primary' | 'secondary'`
3. **Extend existing types** when possible
4. **Use const assertions** for static data
5. **Export types** from constants files

### Import/Export Patterns
```typescript
// Named imports for components
import { Button } from '@components/Button';
import { colors } from '@theme/colors';

// Default imports for app routes
import HomeScreen from './HomeScreen';

// Barrel exports
export { Button } from './Button';
export { Input } from './Input';
```

---

## 🎨 Theme System

### Color System
```typescript
// colors.ts
export const colors = {
  primary: {
    50: '#E6F0FF',
    500: '#007AFF', // Main primary
    900: '#001833',
  },
  // Semantic colors
  success: { 500: '#10B981' },
  error: { 500: '#EF4444' },
  // Component-specific colors
  button: {
    primary: {
      background: '#007AFF',
      text: '#FFFFFF',
      pressed: '#0062CC',
    },
  },
};
```

### Typography System
```typescript
// typography.ts
export const textStyles = {
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  body: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
};
```

### Theme Guidelines
1. **Semantic naming**: Use descriptive color names
2. **Component-specific colors**: Define colors for specific components
3. **Consistent spacing**: Use predefined spacing values
4. **Font families**: Use the Sono font family variants
5. **Responsive design**: Consider different screen sizes

---

## 🎵 Audio System

### Audio File Organization
```
assets/audios/
├── en/                    # English audio files
│   ├── congrats-en.mp3
│   └── counting-fish-en.mp3
└── uz/                    # Uzbek audio files
    ├── congrats-uz.m4a
    └── counting-fish-uz.m4a
```

### Audio Mapping
```typescript
// constants/audio/audioMap.ts
export const audioMap = {
  en: {
    congrats: require('@assets/audios/en/congrats-en.mp3'),
    countingFish: require('@assets/audios/en/counting-fish-en.mp3'),
  },
  uz: {
    congrats: require('@assets/audios/uz/congrats-uz.m4a'),
    countingFish: require('@assets/audios/uz/counting-fish-uz.m4a'),
  },
};
```

### Audio Guidelines
1. **Consistent naming**: `[action]-[language].[extension]`
2. **Language folders**: Separate folders for each language
3. **File formats**: Use `.mp3` for English, `.m4a` for Uzbek
4. **Audio keys**: Use camelCase for audio identifiers
5. **Error handling**: Graceful fallbacks for missing audio

---

## 🧪 Testing Conventions

### Test File Organization
```
src/
├── utils/
│   ├── __tests__/
│   │   ├── audio.test.ts
│   │   └── storage.test.ts
│   └── audio.ts
└── theme/
    ├── __tests__/
    │   └── theme.test.ts
    └── colors.ts
```

### Test Structure
```typescript
import { functionName } from '../functionName';

describe('FunctionName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Test implementation
  });

  it('should handle errors gracefully', () => {
    // Error test
  });
});
```

### Testing Guidelines
1. **Test file naming**: `[function].test.ts`
2. **Test organization**: Group related tests in `describe` blocks
3. **Mock external dependencies**: Mock expo-av, AsyncStorage, etc.
4. **Error scenarios**: Test error handling and edge cases
5. **Async testing**: Use proper async/await patterns

---

## 🛠️ Development Guidelines

### Code Style
1. **ESLint rules**: Follow the project's ESLint configuration
2. **Prettier**: Use Prettier for code formatting
3. **Import order**: Group imports by type (React, external, internal)
4. **Line length**: Maximum 100 characters
5. **Semicolons**: Always use semicolons
6. **Quotes**: Single quotes for strings

### Performance Guidelines
1. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
2. **Image optimization**: Use appropriate image formats and sizes
3. **Bundle size**: Monitor and optimize bundle size
4. **Memory management**: Clean up resources in useEffect cleanup
5. **Animation performance**: Use `react-native-reanimated` for smooth animations

### Error Handling
1. **Error boundaries**: Wrap components in error boundaries
2. **Graceful degradation**: Provide fallbacks for failed operations
3. **User feedback**: Show appropriate error messages
4. **Logging**: Log errors for debugging
5. **Recovery**: Provide ways to recover from errors

### Accessibility
1. **Touch targets**: Minimum 44x44 points
2. **Color contrast**: Ensure sufficient contrast ratios
3. **Screen readers**: Add appropriate accessibility labels
4. **Keyboard navigation**: Support keyboard navigation where applicable
5. **Audio cues**: Provide audio feedback for important actions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd Ilmcha

# Install dependencies
npm install

# Start development server
npm start
```

### Development Commands
```bash
# Development
npm start              # Start Expo development server
npm run android        # Start Android development
npm run ios           # Start iOS development
npm run web           # Start web development

# Testing
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run type-check    # Run TypeScript type checking
npm run format        # Format code with Prettier

# Building
npm run build:android # Build Android APK
npm run build:ios     # Build iOS app
```

---

## 📱 Platform Support

### Supported Platforms
- **iOS**: 13.0+
- **Android**: API level 21+
- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Platform-Specific Considerations
1. **iOS**: Use iOS-specific styling and behavior
2. **Android**: Handle Android-specific navigation and gestures
3. **Web**: Ensure web compatibility and keyboard navigation
4. **Cross-platform**: Test on all platforms before releasing

---

## 🔧 Configuration

### Environment Variables
```bash
# .env (create if needed)
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_ENVIRONMENT=development
```

### Build Configuration
- **EAS Build**: Configured in `eas.json`
- **App Configuration**: Configured in `app.json`
- **Babel Configuration**: Configured in `babel.config.js`

---

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### Tools
- [Expo DevTools](https://docs.expo.dev/workflow/expo-dev-tools/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) (for debugging)

---

## 🤝 Contributing

### Before Contributing
1. **Read this documentation** thoroughly
2. **Follow the coding conventions** outlined above
3. **Write tests** for new functionality
4. **Test on multiple platforms** before submitting
5. **Update documentation** if needed

### Pull Request Guidelines
1. **Clear description** of changes
2. **Screenshots** for UI changes
3. **Test coverage** for new features
4. **No breaking changes** without discussion
5. **Follow the commit message convention**

### Commit Message Convention
```
type(scope): description

feat: add new treasure collection feature
fix: resolve audio playback issue
docs: update README with new conventions
test: add tests for reward system
refactor: improve component organization
```

---

## 🆘 Troubleshooting

### Common Issues
1. **Audio not playing**: Check audio file paths and permissions
2. **Build failures**: Clear cache with `npm run clean:cache`
3. **Type errors**: Run `npm run type-check` to identify issues
4. **Performance issues**: Use React DevTools to profile components
5. **Navigation issues**: Check route configuration in app directory

### Getting Help
1. **Check existing issues** in the repository
2. **Search documentation** for similar problems
3. **Create detailed issue reports** with reproduction steps
4. **Include device/OS information** when reporting bugs

---

Thank you for contributing to Ilmcha! Learning is an adventure! 🐧🏝️
