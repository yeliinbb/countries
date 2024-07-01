import { createClient } from "@supabase/supabase-js";
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;


if (!supabaseUrl) {
  throw new Error("supabaseUrl is required.");
}

if (!supabaseKey) {
  throw new Error("supabaseAnonKey is required.");
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);


export default supabase;
