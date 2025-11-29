// lib/supabase/supabase-client.ts
"use client"; // クライアントでも使うなら付けておく

import { createBrowserClient } from "@supabase/ssr";
// もしくはチュートリアル通りの import でOK

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
