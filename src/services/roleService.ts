import { supabase } from '../lib/supabase';
import { Role } from '../types';

export const roleService = {
  async getRoles() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Role[];
  },

  async createRole(role: Partial<Role>) {
    const { data, error } = await supabase
      .from('roles')
      .insert([{
        name: role.name,
        description: role.description
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRole(id: string, updates: Partial<Role>) {
    const { data, error } = await supabase
      .from('roles')
      .update({
        name: updates.name,
        description: updates.description
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRole(id: string) {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
