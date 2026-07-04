// scripts/supabase-config.js

// Вставьте ваши реальные данные из Supabase
const SUPABASE_URL = "https://tlzjedxzniyxzqajnlui.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Bq5vpy5dpGiGnTb9qTLBeg_v5yuXtAn";

// Инициализируем глобальный клиент Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);