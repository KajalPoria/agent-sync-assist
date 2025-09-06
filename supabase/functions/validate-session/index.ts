import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionToken } = await req.json()
    
    if (!sessionToken) {
      throw new Error('Session token is required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Validate session token with Descope
    // Note: You would implement actual Descope validation here
    // For demo purposes, we'll simulate validation
    const isValid = sessionToken.length > 10 // Simple validation
    const userId = isValid ? 'demo-user-id' : null

    // Log the validation attempt
    const { error: logError } = await supabase
      .from('session_logs')
      .insert({
        session_token: sessionToken.substring(0, 20) + '...', // Don't store full token
        user_id: userId,
        validation_status: isValid,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })

    if (logError) {
      console.error('Failed to log session validation:', logError)
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid session token' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        valid: true, 
        userId: userId,
        message: 'Session token validated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Session validation error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})