import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmbfxekvvzdgjtlgvmvq.supabase.co' // url base
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYmZ4ZWt2dnpkZ2p0bGd2bXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDg3NzcsImV4cCI6MjA2MTQ4NDc3N30.hZABd4Cqaxok0NRXicsfIJAhiE-fYG8hye96RdClTVU' // clave anon
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;