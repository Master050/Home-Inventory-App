import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qcepwuarxkrwgkpuiouy.supabase.co';
const supabaseAnonKey = 'sb_publishable_103ULnEIWH0PMGfEeJbUOw_Xk7uqfjL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
