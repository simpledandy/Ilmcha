import { supabase } from './supabaseClient';
import { storage } from './storage';

export const authUtils = {
  /**
   * Check if the current session is valid and refresh if needed
   */
  async validateAndRefreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        await storage.clearAuth();
        return false;
      }
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;
      if (expiresAt && (expiresAt - now) < fiveMinutes) {
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshedSession) {
          await storage.clearAuth();
          return false;
        }
        if (refreshedSession.access_token) {
          await storage.setAuthToken(refreshedSession.access_token);
        }
        return true;
      }
      return true;
    } catch {
      await storage.clearAuth();
      return false;
    }
  },

  /**
   * Get the current user's profile with additional data
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        avatar: user.user_metadata?.avatar_url,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
      };
    } catch {
      return null;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: { name?: string; avatar_url?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user has completed onboarding
   */
  async checkOnboardingStatus() {
    const userData = await storage.getUserData();
    return !userData?.needsOnboarding;
  },

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding() {
    const userData = await storage.getUserData();
    if (userData) {
      const updatedUserData = { ...userData, needsOnboarding: false };
      await storage.setUserData(updatedUserData);
      return true;
    }
    return false;
  },
}; 