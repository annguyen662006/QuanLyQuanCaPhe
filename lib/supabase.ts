
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khalygmwdvqjjktrlzpo.supabase.co';
const supabaseAnonKey = 'sb_publishable_SnJbNPF1SHSbXiX_oSo12Q_Gh9NrmxI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
