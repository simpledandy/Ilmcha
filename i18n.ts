import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Define translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Ilmcha!',
      welcomeSubtitle: 'The best learning platform for your child',
      login: 'I have an account',
      signup: 'Create account',
      welcomeTales: 'Welcome to Tales',
      parentalZoneTitle: 'For Parents',
      reports: 'Reports',
      blockFunctions: 'Block Features',
      screenTime: 'Manage Screen Time',
      otherDevices: 'Other Devices',
      settings: 'Settings',

      // Auth translations
      signupTitle: 'Ready for a new adventure?',
      signupButton: 'Sign Up',
      haveAccount: 'Already have an account? Log In',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Your email address',
      passwordPlaceholder: 'Your password',
      confirmPasswordPlaceholder: 'Confirm Password',
      allFieldsRequired: 'All fields are required',
      passwordsDontMatch: 'Passwords do not match',
      signupError: 'Error during signup',
      loginTitle: 'Welcome back!',
      loginButton: 'Log In',
      noAccount: "Don't have an account? Create one",
      forgotPassword: 'Forgot password?',
      loginError: 'Login error occurred',
      forgotPasswordTitle: 'Reset Password',
      forgotPasswordSubtitle: 'Enter your email address. We will send you instructions to reset your password.',
      resetPasswordButton: 'Reset Password',
      backToLoginButton: 'Back to Login',
      resetSuccessMessage: 'Password reset instructions have been sent to your email',
      emailRequiredError: 'Email is required',
      resetError: 'An error occurred. Please try again',

      // Onboarding translations
      newAccount: 'New Account',
      back: '← Back',
      childNamePlaceholder: "Your child's name",
      childAgePlaceholder: "Your child's age",
      save: 'SAVE',
      logout: 'Log Out',
      ageGroupLabel: 'Select Age Group',
      ageGroup_2_3: '2-3 years',
      ageGroup_4_5: '4-5 years',
      ageGroup_6_7: '6-7 years',
      ageGroup_7_plus: '7+ years',

      // General UI
      letters: 'LETTERS',
      numbers: 'NUMBERS',
      next: 'NEXT',
      loading: 'Loading...',
      error: 'Error',
      continue: 'Continue',
      complete: 'Complete',
      goBack: 'Go Back',
      cancel: 'Cancel',
      leave: 'Leave',
      congratulations: 'Congratulations!',

      // Island Names and Subtitles
      islandAlphabetTitle: 'Alifboland',
      islandAlphabetSubtitle: 'Alphabet & Basic Words',
      islandBasicsTitle: 'Greetings',
      islandBasicsSubtitle: 'Greetings & Basics',
      islandNumbersTitle: 'Numeria',
      islandNumbersSubtitle: 'Numbers 1-10',
      islandShapesTitle: 'Shapes',
      islandShapesSubtitle: 'Coming Soon',
      islandColorsTitle: 'Colors',
      islandColorsSubtitle: 'Coming Soon',
      islandFamilyTitle: 'Family',
      islandFamilySubtitle: 'Coming Soon',
      islandFoodTitle: 'Food',
      islandFoodSubtitle: 'Coming Soon',
      islandConversationTitle: 'Conversation',
      islandConversationSubtitle: 'Coming Soon',
    },
  },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.startsWith('uz') ? 'uz' : 'en',
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
