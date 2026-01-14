// IMPORT SUPABASE DATA
import { supabase } from "./supabaseClient.js";

// REGISTER
export async function register(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session available");

  const user = session.user;

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      name,
    });

  if (profileError) throw profileError;

  return user;
}

// LOGIN
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) throw error;
  
    return data.user;
  }
  