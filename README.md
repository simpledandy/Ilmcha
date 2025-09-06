# 🐧 Ilmcha - Interactive Learning Adventure

<div align="center">

![Ilmcha Logo](./assets/images/icon.png)

**An immersive educational app for children featuring a magical penguin guide through interactive learning islands**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.20-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.51.0-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

## 🌟 Overview

Ilmcha is a comprehensive educational mobile application designed to make learning fun and engaging for children. The app features a charming penguin character named Ilmcha who guides young learners through various educational islands, each focusing on different learning topics like numbers, letters, shapes, colors, and time.

### 🎯 Key Features

- **🏝️ Interactive Island System**: Explore 5 unique learning islands with distinct themes
- **🐧 Animated Penguin Guide**: Meet Ilmcha, your friendly learning companion
- **🎮 Multiple Learning Activities**: Tracing, counting, matching, sequencing, and more
- **🌍 Multilingual Support**: Available in English, Uzbek, and Russian
- **📚 Interactive Tales**: Engaging stories with audio narration
- **👨‍👩‍👧‍👦 Multi-Child Support**: Parents can manage multiple children's progress
- **🔐 Secure Authentication**: Built with Supabase for reliable user management
- **📱 Cross-Platform**: Works on iOS, Android, and Web

## 🏝️ Learning Islands

### 1. **Numeriya** (Numbers Island)
- Learn numbers 1-10 through interactive activities
- Number tracing with visual feedback
- Counting games and exercises
- Number recognition challenges

### 2. **Alifboland** (Alphabet Island)
- Letter recognition and tracing
- Upper and lowercase matching
- Letter sequencing activities
- Vocabulary building exercises

### 3. **Shaklandiya** (Shapes Island)
- Shape identification and tracing
- Pattern recognition games
- Spatial reasoning activities
- Shape arrangement puzzles

### 4. **Rangoria** (Colors Island)
- Color recognition and naming
- Color mixing concepts
- Pattern creation with colors
- Color-based sorting activities

### 5. **Vaqtriya** (Time Island)
- Time concepts and clock reading
- Daily routine activities
- Time-based sequencing
- Temporal awareness exercises

## 🎮 Learning Activities

### ✍️ **Tracing Adventures**
- Interactive finger tracing with haptic feedback
- Visual guides and hints
- Progress tracking and achievements
- Adaptive difficulty based on performance

### 🔢 **Counting Games**
- Interactive counting with visual objects
- Number recognition challenges
- Quantity comparison exercises
- Real-world counting scenarios

### 🧩 **Matching & Sequencing**
- Pattern recognition games
- Logical sequence building
- Memory enhancement activities
- Problem-solving challenges

### 🎯 **Hunting Games**
- Object identification and collection
- Spatial awareness development
- Hand-eye coordination improvement
- Focus and attention training

### 📖 **Interactive Tales**
- Audio-narrated stories in multiple languages
- Character-driven learning experiences
- Moral and educational themes
- Immersive storytelling with visual elements

## 🛠️ Technology Stack

### **Frontend**
- **React Native 0.79.5** - Cross-platform mobile development
- **Expo 53.0.20** - Development platform and tools
- **TypeScript 5.8.3** - Type-safe development
- **React Native Reanimated 3.17.4** - Smooth animations
- **React Native Gesture Handler 2.24.0** - Touch interactions
- **React Native SVG 15.11.2** - Vector graphics

### **Backend & Services**
- **Supabase 2.51.0** - Backend-as-a-Service
- **PostgreSQL** - Database management
- **Row Level Security** - Data protection

### **Development Tools**
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance
- **TypeScript** - Static type checking

### **Internationalization**
- **i18next** - Internationalization framework
- **expo-localization** - Device locale detection

## 📱 Screenshots & Demo

### 🎬 Version Showcase

> **Note**: Add your GIFs here to showcase the app's evolution across versions

#### **Version 1.0.0 - Current Release**
![Version 1.0.0 Demo](./docs/gifs/version-1.0.0-demo.gif)

![Version 0.9.0 Demo](./docs/gifs/version-1.0.1-demo.gif)

#### **Previous Versions**

![Version 0.8.0 Demo](./docs/gifs/version-0.8.0-demo.gif)

![Version 0.8.0 Demo](./docs/gifs/version-0.9.0-demo.gif)

### 🖼️ Feature Highlights

![Ocean Map](./docs/screenshots/auth-screens.gif)

![Tracing Activity](./docs/screenshots/parental-zone.gif)

<!-- ![Tales Screen](./docs/screenshots/tales-screen.png) -->
*Add tales screen screenshot*

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ilmcha.git
   cd ilmcha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Project Structure

```
ilmcha/
├── src/
│   ├── app/                    # App screens and navigation
│   │   ├── (app)/             # Authenticated app screens
│   │   └── (auth)/            # Authentication screens
│   ├── components/            # Reusable UI components
│   │   ├── adventures/        # Learning activity components
│   │   └── ...
│   ├── constants/             # App constants and data
│   ├── hooks/                 # Custom React hooks
│   ├── providers/             # Context providers
│   ├── theme/                 # Design system
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── assets/                    # Images, audio, and other assets
├── i18n.ts                    # Internationalization setup
└── app.config.js             # Expo configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: `#007AFF` (iOS Blue)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Playful Colors**: Purple, Orange, Pink, Teal

### Typography
- **Font Family**: Fredoka (Bold, SemiBold, Medium, Regular, Light)
- **Responsive sizing** based on screen dimensions

### Components
- **AppButton**: Consistent button styling
- **AppText**: Typography component with variants
- **AppImage**: Optimized image component
- **AppInput**: Form input component

## 🔧 Development

### Available Scripts

```bash
# Development
npm start                 # Start Expo development server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run on web browser

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier

# Building
npm run build:android    # Build Android APK
npm run build:ios        # Build iOS app

# Utilities
npm run clean            # Clean node_modules
npm run analyze          # Run Expo doctor
```

### Code Quality

The project enforces high code quality standards:

- **ESLint** configuration with Expo rules
- **Prettier** for consistent code formatting
- **TypeScript** for type safety
- **Husky** pre-commit hooks
- **Lint-staged** for staged file linting

### Git Workflow

```bash
# Pre-commit checks (automatically run)
npm run type-check && npm run lint && npx expo-doctor
```

## 🌍 Internationalization

Ilmcha supports three languages:

- **English** (en) - Default language
- **Uzbek** (uz) - Primary target language
- **Russian** (ru) - Secondary language

### Adding New Translations

1. Update the translation files:
   - `i18n.general.ts` - General app translations
   - `i18n.auth.ts` - Authentication translations

2. Use the translation hook in components:
   ```typescript
   import { useTranslation } from 'react-i18next';
   
   const { t } = useTranslation();
   return <Text>{t('welcome')}</Text>;
   ```

## 📊 Performance & Analytics

### Optimizations
- **Lazy loading** of components and screens
- **Image optimization** with Expo Image
- **Memory management** for audio playback
- **Gesture optimization** for smooth interactions

### Monitoring
- **Error tracking** with custom error reporting
- **Performance monitoring** for app responsiveness
- **User analytics** for learning progress

## 🤝 Contributing

We welcome contributions to Ilmcha! Here's how you can help:

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include device information and steps to reproduce
- Provide screenshots or videos when possible

### 💡 Feature Requests
- Submit feature requests through GitHub Issues
- Describe the educational value and user experience
- Consider accessibility and child safety

### 🔧 Development Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run check-all`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 📋 Contribution Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all quality checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for the robust framework
- **Supabase** for the backend infrastructure
- **Educational Experts** who provided learning methodology guidance
- **Beta Testers** who helped refine the user experience

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/ilmcha/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ilmcha/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ilmcha/discussions)
- **Email**: support@ilmcha.app

## 🗺️ Roadmap

### 🎯 Upcoming Features
- [ ] **Advanced Analytics Dashboard** for parents
- [ ] **Offline Mode** for learning without internet
- [ ] **Voice Recognition** for pronunciation practice
- [ ] **AR Integration** for immersive learning experiences
- [ ] **Social Features** for collaborative learning
- [ ] **Additional Languages** (Spanish, French, Arabic)

### 🔮 Future Versions
- **v1.1.0**: Enhanced parent dashboard and progress tracking
- **v1.2.0**: Offline capabilities and sync
- **v2.0.0**: AR features and advanced interactions

---

<div align="center">

**Made with ❤️ for children's education**

*Ilmcha - Where learning becomes an adventure!*

[⭐ Star this repo](https://github.com/yourusername/ilmcha) | [🐛 Report Bug](https://github.com/yourusername/ilmcha/issues) | [💡 Request Feature](https://github.com/yourusername/ilmcha/issues)

</div>
