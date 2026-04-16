import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.")
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")

// Function to add a note to the database
export async function addNote(userId: string, title: string, content: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        { user_id: userId, title, content, created_at: new Date().toISOString() },
      ]);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error adding note:', error.message);
    throw error;
  }
}

// Function to fetch notes for a specific user
export async function fetchNotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching notes:', error.message);
    throw error;
  }
}
