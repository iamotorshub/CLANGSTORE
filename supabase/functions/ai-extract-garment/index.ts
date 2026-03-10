const garmentCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GARMENT_GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Strip the data:...;base64, prefix and return raw base64 + detected mime */
function garmentParseBase64(input: string): { data: string; mimeType: string } {
  const match = input.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (match) return { mimeType: match[1], data: match[2] };
  return { mimeType: 'image/jpeg', data: input };
}

/** Call Gemini generateContent and return raw JSON */
async function garmentCallGemini(
  apiKey: string,
  model: string,
  parts: unknown[],
  generationConfig?: Record<string, unknown>,
): Promise<any> {
  const body: Record<string, unknown> = {
    contents: [{ parts }],
  };
  if (generationConfig) body.generationConfig = generationConfig;

  const res = await fetch(`${GARMENT_GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini ${model} ${res.status}: ${txt}`);
  }
  return res.json();
}

/** Extract first image (as data-URL) from a Gemini response */
function garmentExtractImageFromResponse(data: any): string | null {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return `data:${p.inlineData.mimeType || 'image/png'};base64,${p.inlineData.data}`;
    }
  }
  return null;
}

/** Extract text from a Gemini response */
function garmentExtractTextFromResponse(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.filter((p: any) => p.text).map((p: any) => p.text).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: garmentCorsHeaders });
  }

  try {
    const { imageBase64, prompt } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image is required' }),
        { status: 400, headers: { ...garmentCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'GEMINI_API_KEY not configured. Add it as a Supabase secret.' }),
        { status: 500, headers: { ...garmentCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractionPrompt = prompt || 'Extract the main garment from this image';
    const { data: imgData, mimeType } = garmentParseBase64(imageBase64);

    // ── Step 1: Analyze the garment with Gemini vision ──────────────
    const analysisSystemPrompt = `You are a fashion AI expert. The user will provide an image and ask you to extract/identify a specific garment. 
Analyze the image and return a JSON object with:
- "garment_name": the name of the garment in Spanish (e.g. "Campera negra de cuero")
- "garment_description": detailed description for image generation prompts in English (color, material, style, details, fit)
- "garment_type": category (jacket, jeans, top, dress, set, shorts, shirt)
- "variants": array of 4 objects, each with a "description" field that is a slightly different angle/styling description of the same isolated garment on a clean white background, for product photography. Each description should be in English and highly detailed.

Return ONLY valid JSON, no markdown.`;

    const analysisParts = [
      { text: `${analysisSystemPrompt}\n\nUser request: ${extractionPrompt}` },
      { inline_data: { mime_type: mimeType, data: imgData } },
    ];

    const analysisRes = await garmentCallGemini(apiKey, 'gemini-2.0-flash', analysisParts);
    const content = garmentExtractTextFromResponse(analysisRes);

    let garmentData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      garmentData = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error('Failed to parse AI response:', content);
      garmentData = {
        garment_name: 'Prenda detectada',
        garment_description: 'A fashion garment isolated on white background',
        garment_type: 'unknown',
        variants: [
          { description: 'Front view of the garment on white background' },
          { description: 'Side angle view of the garment on white background' },
          { description: 'Detail view showing texture and material' },
          { description: 'Back view of the garment on white background' },
        ],
      };
    }

    // ── Step 2: Generate extracted garment image ──────────────
    try {
      const imgPrompt = `You are a professional fashion editor. CRITICAL TASK: Extract and isolate the garment "${garmentData.garment_name}" from the provided image.
Description: ${garmentData.garment_description}.

EXECUTION RULES:
1. BACKGROUND: Remove EVERYTHING except the garment. Replace with a PURE, SOLID WHITE background (#FFFFFF).
2. ISOLATION: Do NOT include any person, skin, hair, mannequins, or hangers. Only the fabric and structure of the garment.
3. QUALITY: Center the garment perfectly. Ensure it looks high-fidelity, professional, with clean edges (anti-aliased). 
4. LIGHTING: Ensure the colors are vibrant and accurate, with soft studio lighting.

The output MUST be a clean, e-commerce ready product photo of the isolated garment.`;

      const genParts = [
        { text: imgPrompt },
        { inline_data: { mime_type: mimeType, data: imgData } },
      ];

      const genRes = await garmentCallGemini(
        apiKey,
        'gemini-2.0-flash',
        genParts,
        { responseModalities: ['Text', 'Image'] },
      );

      const resultImage = garmentExtractImageFromResponse(genRes);

      return new Response(
        JSON.stringify({
          success: true,
          garment: garmentData,
          extractedImages: resultImage ? [resultImage] : [],
        }),
        { headers: { ...garmentCorsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error(`Error generating isolated garment:`, err);
      throw err;
    }
  } catch (error) {
    console.error('Error in ai-extract-garment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...garmentCorsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
