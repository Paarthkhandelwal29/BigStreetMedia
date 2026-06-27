import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || (!supabaseAnonKey && !serviceRoleKey)) {
    return null;
  }

  const create = () =>
    createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

  // In dev, Turbopack hot-reload can leave the module-level singleton holding a
  // stale client; build a fresh one each call. In prod, reuse the singleton.
  if (process.env.NODE_ENV === "development") {
    return create();
  }

  if (!client) {
    client = create();
  }
  return client;
}
