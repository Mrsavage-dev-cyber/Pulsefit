// Proxies Gemini generateContent calls so the API key stays server-side.
// Only signed-in PulseFit users can call it: the caller's Supabase session token is checked below.
// Deploy with --no-verify-jwt; auth is enforced here so it works with the new publishable/secret keys.
import { GoogleGenAI } from 'npm:@google/genai@^2.24.0'
import { createClient } from 'npm:@supabase/supabase-js@^2.117.2'

const ALLOWED_MODELS = new Set(['gemini-3.5-flash'])

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

const apiKey = Deno.env.get('GEMINI_API_KEY')
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  const { data: auth } = token ? await supabase.auth.getUser(token) : { data: { user: null } }
  if (!auth.user) return json({ error: 'Sign in to use PulseFit AI.' }, 401)

  if (!ai) return json({ error: 'GEMINI_API_KEY is not configured on the server.' }, 500)

  let params: { model?: string; contents?: unknown; config?: Record<string, unknown> }
  try {
    params = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!params.model || !ALLOWED_MODELS.has(params.model) || params.contents === undefined) {
    return json({ error: 'Invalid request' }, 400)
  }

  try {
    const response = await ai.models.generateContent({
      model: params.model,
      // deno-lint-ignore no-explicit-any
      contents: params.contents as any,
      config: params.config,
    })
    return json({ text: response.text ?? '' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return json({ error: message }, 502)
  }
})
