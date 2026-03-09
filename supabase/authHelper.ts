import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;


export const supabase = createClient(SUPABASE_URL, PUBLIC_KEY);
