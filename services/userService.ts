import { supabase } from '@/lib/supabase';

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data };
    // Pretty sure there isn't a true way to handle it
  } catch (error: any) {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    return { success: false, msg: error.message };
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId);
    if (error) {
      return { success: false, msg: error.message };
    }

    return { success: true, data };
    // Pretty sure there isn't a true way to handle it
  } catch (error: any) {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    return { success: false, msg: error.message };
  }
};
