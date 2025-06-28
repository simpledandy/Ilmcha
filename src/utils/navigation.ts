import { router } from "expo-router";

// Define all route names and their params here for type safety
export type AppRoutes =
  | { name: "/"; params?: undefined }
  | { name: "/signup"; params?: undefined }
  | { name: "/login"; params?: undefined }
  | { name: "/forgot-password"; params?: undefined }
  | { name: "/(app)"; params?: undefined }
  | { name: "/(app)/onboarding"; params?: undefined }
  | { name: "/(auth)"; params?: undefined }
  | { name: "/parental-zone"; params?: undefined }
  | { name: "/settings"; params?: undefined }
  | { name: "/reports"; params: { childId: string } }
  | { name: "/(app)/[island]"; params: { island: string } }
  | {
      name: "/(app)/[island]/[lesson]";
      params: { island: string; lesson: string };
    }
  | { name: "/tale"; params?: undefined };
// Add more routes as needed

// Helper to push a route with params
export function navigate(route: string, params?: Record<string, string>) {
  if (params) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    router.push(route as any, params);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    router.push(route as any);
  }
}

// Helper to replace a route with params
export function replace(route: string, params?: Record<string, string>) {
  if (params) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    router.replace(route as any, params);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    router.replace(route as any);
  }
}

// Helper to go back
export function goBack() {
  router.back();
}
