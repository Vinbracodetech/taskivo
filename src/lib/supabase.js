import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eartsscxtqxaelopmjmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcnRzc2N4dHF4YWVsb3Btam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTIwNjcsImV4cCI6MjA5MzM4ODA2N30.mqUbY0IaaUoNfJn3luTklD2_5NX8yOr8b1Z9aLEe7Bs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
