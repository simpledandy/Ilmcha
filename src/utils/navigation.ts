import { router } from 'expo-router';

// Define all route names and their params here for type safety
export type AppRoutes =
  | { name: '/'; params?: undefined }
  | { name: '/signup'; params?: undefined }
  | { name: '/login'; params?: undefined }
  | { name: '/forgot-password'; params?: undefined }
  | { name: '/(app)'; params?: undefined }
  | { name: '/(app)/onboarding'; params?: undefined }
  | { name: '/(auth)'; params?: undefined }
  | { name: '/parental-zone'; params?: undefined }
  | { name: '/settings'; params?: undefined }
  | { name: '/reports'; params: { childId: string } }
  | { name: '/(app)/[island]'; params: { island: string } }
  | { name: '/(app)/[island]/[lesson]'; params: { island: string; lesson: string } }
  | { name: '/tale'; params?: undefined }
  // Add more routes as needed
;

// Helper to push a typed route
export function navigate(route: AppRoutes) {
  if (route.params) {
    router.push({ pathname: route.name, params: route.params });
  } else {
    router.push(route.name);
  }
}

// Helper to replace a typed route
export function replace(route: AppRoutes) {
  if (route.params) {
    router.replace({ pathname: route.name, params: route.params });
  } else {
    router.replace(route.name);
  }
}

// Helper to go back
export function goBack() {
  router.back();
} 