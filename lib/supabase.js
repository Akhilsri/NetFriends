import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import {YOUR_REACT_NATIVE_SUPABASE_URL,YOUR_REACT_NATIVE_SUPABASE_ANON_KEY} from '../constants/index'
import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL
const supabaseAnonKey = YOUR_REACT_NATIVE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})