import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@utils/supabaseClient';
import { useAuth } from './useAuth';
import type { Child, ChildWithStats, AddChildData } from '../types/children';

export function useChildren() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch children with their stats
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select(`
          *,
          child_stats (*)
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (childrenError) {
        throw childrenError;
      }

      // Transform the data to match our interface
      const transformedChildren: ChildWithStats[] = (childrenData || []).map((child: any) => ({
        id: child.id,
        parent_id: child.parent_id,
        name: child.name,
        avatar_url: child.avatar_url,
        created_at: child.created_at,
        date_of_birth: child.date_of_birth,
        stats: child.child_stats?.[0] || {
          child_id: child.id,
          total_xp: 0,
          coins: 0,
          stars: 0,
        },
      }));

      setChildren(transformedChildren);
    } catch (err: any) {
      console.error('Error fetching children:', err);
      setError(err.message || 'Failed to fetch children');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const addChild = useCallback(async (childData: AddChildData): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setError(null);

      // Insert the child
      const { data: child, error: childError } = await supabase
        .from('children')
        .insert([{
          parent_id: user.id,
          name: childData.name,
          date_of_birth: childData.date_of_birth,
          avatar_url: childData.avatar_url,
        }])
        .select()
        .single();

      if (childError) {
        throw childError;
      }

      // Create default stats for the child
      const { error: statsError } = await supabase
        .from('child_stats')
        .insert([{
          child_id: child.id,
          total_xp: 0,
          coins: 0,
          stars: 0,
        }]);

      if (statsError) {
        console.error('Error creating child stats:', statsError);
        // Don't throw here as the child was created successfully
      }

      // Refresh the children list
      await fetchChildren();

      return { success: true };
    } catch (err: any) {
      console.error('Error adding child:', err);
      return { success: false, error: err.message || 'Failed to add child' };
    }
  }, [user?.id, fetchChildren]);

  const updateChild = useCallback(async (childId: string, updates: Partial<Child>): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId);

      if (error) {
        throw error;
      }

      // Refresh the children list
      await fetchChildren();

      return { success: true };
    } catch (err: any) {
      console.error('Error updating child:', err);
      return { success: false, error: err.message || 'Failed to update child' };
    }
  }, [fetchChildren]);

  const deleteChild = useCallback(async (childId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      // Delete child stats first (due to foreign key constraint)
      const { error: statsError } = await supabase
        .from('child_stats')
        .delete()
        .eq('child_id', childId);

      if (statsError) {
        console.error('Error deleting child stats:', statsError);
      }

      // Delete the child
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) {
        throw error;
      }

      // Refresh the children list
      await fetchChildren();

      return { success: true };
    } catch (err: any) {
      console.error('Error deleting child:', err);
      return { success: false, error: err.message || 'Failed to delete child' };
    }
  }, [fetchChildren]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    loading,
    error,
    fetchChildren,
    addChild,
    updateChild,
    deleteChild,
  };
} 