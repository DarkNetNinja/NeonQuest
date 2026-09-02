import { createBrowserClient } from "@supabase/ssr"

// Project URL is not secret, so we keep it as a constant. The anon key is
// exposed to the browser via NEXT_PUBLIC_SUPABASE_ANON_KEY.
export const SUPABASE_URL = "https://gyjwpgcnhdppdchhmbtu.supabase.co"

export function createClient() {
  return createBrowserClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // Secure cookies in production; not in dev, so localhost still works.
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
  })
}
