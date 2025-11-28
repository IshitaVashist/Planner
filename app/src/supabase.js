import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxurwuoxoizyljiqjvze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dXJ3dW94b2l6eWxqaXFqdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTYzNzcsImV4cCI6MjA3ODg5MjM3N30.xNiGrf5lNC24ZH7n81MuyKiTW28cWbNARhNbTvQJPvo';

export const supabase = createClient(supabaseUrl, supabaseKey);