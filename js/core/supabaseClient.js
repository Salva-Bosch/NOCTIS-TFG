import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://clmkybwkckthecpztuwi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbWt5YndrY2t0aGVjcHp0dXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTMzODAsImV4cCI6MjA4MzUyOTM4MH0.zJnA8WW9r3CpmyKgfGEX694UibbXUTcWl-_Ym5w7oVI";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
