const tryonCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TRYON_GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const TRYON_IMAGE_MODEL = 'gemini-2.0-flash';

/** Strip the data:...;base64, prefix and return raw base64 + detected mime */
function tryonParseBase64(input: string): { data: string; mimeType: string } {
  const match = input.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (match) return { mimeType: match[1], data: match[2] };
  return { mimeType: 'image/jpeg', data: input };
}

/** Extract first image (as data-URL) from a Gemini response */
function tryonExtractImageFromResponse(resData: any): string | null {
  const parts = resData?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return `data:${p.inlineData.mimeType || 'image/png'};base64,${p.inlineData.data}`;
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: tryonCorsHeaders });
  }

  try {
    const { userPhotoBase64, garmentName, garmentDescription, garmentImageBase64, size } = await req.json();

    if (!userPhotoBase64 || !garmentName) {
      return new Response(
        JSON.stringify({ success: false, error: 'User photo and garment are required' }),
        { status: 400, headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'GEMINI_API_KEY not configured. Add it as a Supabase secret.' }),
        { status: 500, headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sizeInfo = size ? ` in size ${size}` : '';
    const prompt = `CRITICAL: You are a professional virtual fashion try-on AI. 
YOUR TASK: Generate a new image of the person in the provided photo wearing the garment described below.

Garment: "${garmentName}" ${sizeInfo}
Description: ${garmentDescription}

INSTRUCTIONS:
1. The person's face, body proportions, skin tone, and pose MUST remain identical to the original photo.
2. The garment must look perfectly fitted and natural on the person.
3. The background and lighting must be preserved from the original photo.
4. Output ONLY the resulting image of the person wearing the garment. No text, no captions.`;

    // Build parts array with text + user photo + optional garment image
    const { data: userImgData, mimeType: userMime } = tryonParseBase64(userPhotoBase64);
    const parts: any[] = [
      { text: prompt },
      { inline_data: { mime_type: userMime, data: userImgData } },
    ];

    // Add garment image if available
    if (garmentImageBase64 && (garmentImageBase64.startsWith('data:') || garmentImageBase64.length > 200)) {
      const { data: garmentData, mimeType: garmentMime } = tryonParseBase64(garmentImageBase64);
      parts.push({ inline_data: { mime_type: garmentMime, data: garmentData } });
    }

    const body = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      },
    };

    const response = await fetch(`${TRYON_GEMINI_BASE}/${TRYON_IMAGE_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429, headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `AI request failed: ${response.status}` }),
        { status: 500, headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const resultImage = tryonExtractImageFromResponse(data);

    return new Response(
      JSON.stringify({ success: true, resultImage }),
      { headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-virtual-tryon:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...tryonCorsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
