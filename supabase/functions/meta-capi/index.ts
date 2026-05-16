import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to hash data (SHA-256) for Meta CAPI
async function hashData(data: string | null | undefined): Promise<string | undefined> {
  if (!data) return undefined;
  const normalized = data.trim().toLowerCase();
  if (normalized === '') return undefined;
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get('META_PIXEL_ID');
    const ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN');

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      throw new Error("Missing Meta API credentials");
    }

    const body = await req.json();
    const { eventName, eventId, eventSourceUrl, userData, customData } = body;

    // Capture standard headers for CAPI matching
    const clientIpAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const clientUserAgent = req.headers.get('user-agent');

    // Hash user data
    // Note: Meta expects phone numbers in E.164 format (e.g. 9779812345678) but without the +
    let normalizedPhone = userData?.ph ? userData.ph.replace(/\D/g, '') : '';
    if (normalizedPhone && normalizedPhone.length === 10) {
      // Assuming Nepal (+977) if 10 digits
      normalizedPhone = '977' + normalizedPhone;
    }

    const hashedFn = await hashData(userData?.fn);
    const hashedLn = await hashData(userData?.ln);
    const hashedPh = await hashData(normalizedPhone);

    const payload = {
      data: [
        {
          event_name: eventName || 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: eventId,
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            fbp: userData?.fbp,
            fbc: userData?.fbc,
            fn: hashedFn ? [hashedFn] : undefined,
            ln: hashedLn ? [hashedLn] : undefined,
            ph: hashedPh ? [hashedPh] : undefined,
          },
          custom_data: {
            currency: customData?.currency || 'NPR',
            value: customData?.value || 28799,
            content_name: customData?.content_name || 'Premium Gaming Chair'
          }
        }
      ]
    };

    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const fbData = await fbRes.json();

    if (!fbRes.ok) {
      console.error("Meta CAPI Error:", fbData);
      return new Response(JSON.stringify({ error: fbData }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ success: true, metaResponse: fbData }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
