import "react-native-url-polyfill/dist/url-shim";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hsekcvyxjqzxarowhcgm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZWtjdnl4anF6eGFyb3doY2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NDQ3OTIsImV4cCI6MjA4MTMyMDc5Mn0.PlcEwbYVd-_dXEXWWU-WuYQ38Sn6PyVTOoQ2NzDYNzo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return user;
}

// Helper function to get session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  return session;
}
