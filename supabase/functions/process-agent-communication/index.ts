import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgentCommunicationRequest {
  delegationTokenId: string
  fromAgent: string
  toAgent: string
  emailContent: string
  parsedInfo: any
  calendarEventData?: any
  userConsentGiven?: boolean
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: AgentCommunicationRequest = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store agent communication log
    const { data, error } = await supabase
      .from('agent_communications')
      .insert({
        delegation_token_id: requestData.delegationTokenId,
        from_agent: requestData.fromAgent,
        to_agent: requestData.toAgent,
        email_content: requestData.emailContent,
        parsed_info: requestData.parsedInfo,
        calendar_event_data: requestData.calendarEventData,
        user_consent_given: requestData.userConsentGiven,
        processing_status: requestData.processingStatus
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to store communication log: ${error.message}`)
    }

    // Simulate delegation token validation
    const tokenValidation = {
      valid: true,
      scopes: ['calendar:write', 'events:create'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        communicationId: data.id,
        tokenValidation,
        message: 'Agent communication processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent communication processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})