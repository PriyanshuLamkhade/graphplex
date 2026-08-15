import { createBrowserClient } from '@supabase/ssr'

export function createClient() {  
  return createBrowserClient(
    "https://cehmhmhgqpnknagvrrpq.supabase.co",
  "sb_publishable_dqvMnTQfiWje_UqHF5_9lA_4bI8VRd3"    
  )
}
