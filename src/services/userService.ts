import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export const userService = {
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Profile[];
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    // Note: In Supabase, usually profiles are updated via auth.users or a trigger.
    // Here we update the public.profiles table.
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        role_id: updates.roleId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProfile(id: string) {
    // Warning: Deleting from profiles won't delete the auth user unless RLS/triggers are set.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
