import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const noop = () => ({ data: null, error: null })
const mockClient = {
  from: () => ({ select: noop, insert: noop, order: () => ({ limit: noop }) }),
  channel: () => ({ on: () => ({ subscribe: noop }) }),
  removeChannel: noop,
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockClient
