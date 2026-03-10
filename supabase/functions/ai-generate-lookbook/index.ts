const lookbookCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOOKBOOK_GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const LOOKBOOK_IMAGE_MODEL = 'gemini-2.0-flash';

const STUDIO_ANGLES = [
  { label: 'Plano General', prompt: 'full body shot, wide angle, showing complete outfit head to toe' },
  { label: 'Plano Detalle', prompt: 'medium close-up shot, focusing on garment details, fabric texture, and fit from waist up' },
  { label: 'Contrapicado', prompt: 'low angle shot looking up, dramatic perspective, powerful and commanding presence' },
  { label: 'Cenital', prompt: 'slightly elevated overhead angle, three-quarter view from above, elegant perspective' },
];

const CAMPAIGN_COMBOS = [
  {
    outfit: 'Falda de cuero negra + botas altas',
    location: 'Noche en París',
    prompt: 'paired with a black leather mini skirt and knee-high boots, nighttime Paris streets with Eiffel Tower lights in bokeh background, dramatic warm streetlight',
  },
  {
    outfit: 'Pantalón sastre beige + stilettos',
    location: 'Museo de Arte Moderno',
    prompt: 'paired with tailored beige trousers and stiletto heels, inside a modern art museum gallery, white walls with contemporary art, natural skylight illumination',
  },
  {
    outfit: 'Jean wide-leg + zapatillas blancas',
    location: 'Café en Buenos Aires',
    prompt: 'paired with wide-leg denim jeans and white sneakers, Buenos Aires sidewalk café, warm golden hour sunlight, marble table with espresso',
  },
  {
    outfit: 'Vestido midi + sandalias doradas',
    location: 'Playa al atardecer',
    prompt: 'as a layering piece over a midi dress with golden sandals, Mediterranean beach at sunset, warm orange and pink sky, gentle waves',
  },
];

const STUDIO_LOCATIONS: Record<string, string> = {
  'studio-white': 'clean white photography studio, professional softbox lighting, infinite white cyclorama background',
  'balcon-parisino': 'elegant Parisian balcony with wrought iron railings, Haussmann building facade, soft morning light',
  'callejon-urbano': 'gritty urban alleyway, brick walls with street art, moody dramatic lighting, cinematic shadows',
  'loft-industrial': 'industrial loft space with exposed brick, steel beams, large factory windows, warm natural light, concrete floors',
};

const negativePrompt = 'cartoon, anime, 3D render, distorted, bad anatomy, blurry, watermark, low quality, oversaturated, amateur, deformed hands, extra fingers';

/** Strip the data:...;base64, prefix and return raw base64 + detected mime */
function lookbookParseBase64(input: string): { data: string; mimeType: string } {
  const match = input.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (match) return { mimeType: match[1], data: match[2] };
  return { mimeType: 'image/jpeg', data: input };
}

/** Extract first image (as data-URL) from a Gemini response */
function lookbookExtractImageFromResponse(resData: any): string | null {
  const parts = resData?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return `data:${p.inlineData.mimeType || 'image/png'};base64,${p.inlineData.data}`;
    }
  }
  return null;
}

async function generateImage(apiKey: string, prompt: string, garmentImageBase64?: string, modelPhotoUrl?: string | string[]): Promise<string | null> {
  const parts: any[] = [{ text: prompt }];

  if (garmentImageBase64) {
    const { data, mimeType } = lookbookParseBase64(garmentImageBase64);
    parts.push({ inline_data: { mime_type: mimeType, data } });
  }

  if (modelPhotoUrl) {
    const urls = Array.isArray(modelPhotoUrl) ? modelPhotoUrl : [modelPhotoUrl];
    for (const url of urls) {
      if (url.startsWith('data:') || url.length > 200) {
        const { data, mimeType } = lookbookParseBase64(url);
        parts.push({ inline_data: { mime_type: mimeType, data } });
      }
    }
  }

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['Text', 'Image'],
    },
  };

  const res = await fetch(`${LOOKBOOK_GEMINI_BASE}/${LOOKBOOK_IMAGE_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error(`Image generation failed: ${res.status} — ${txt}`);
    return null;
  }

  const resData = await res.json();
  return lookbookExtractImageFromResponse(resData);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: lookbookCorsHeaders });
  }

  try {
    const body = await req.json();
    const { garmentDescription, garmentImageBase64, mode, customModelPrompt, modelPhotoUrl, locationId, photoCount } = body;

    if (!garmentDescription) {
      return new Response(
        JSON.stringify({ success: false, error: 'Garment description is required' }),
        { status: 400, headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'GEMINI_API_KEY not configured. Add it as a Supabase secret.' }),
        { status: 500, headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const modelPrompt = customModelPrompt || 'a beautiful female fashion model, age 25-28, natural skin texture';
    const modelRefNote = modelPhotoUrl ? '. Use the reference model photo for facial likeness and body type consistency' : '';

    // ── MODE: CASTING — single photo of model with garment ──────────
    if (mode === 'casting') {
      const prompt = `Generate an ultra-realistic fashion editorial photograph. Model: ${modelPrompt}${modelRefNote}. She is wearing: ${garmentDescription}. Setting: clean white studio, soft even lighting. shot on Canon EOS R5 85mm f/1.8. 8K resolution, Vogue editorial quality, professional fashion photography. Do NOT include: ${negativePrompt}`;
      const image = await generateImage(apiKey, prompt, garmentImageBase64, modelPhotoUrl);
      return new Response(
        JSON.stringify({ success: true, photos: [{ scenario: 'Casting', image, angle: 'Plano General' }] }),
        { headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── MODE: STUDIO — 4 photos, same location, 4 angles ────────────
    if (mode === 'studio') {
      const location = STUDIO_LOCATIONS[locationId || 'studio-white'] || STUDIO_LOCATIONS['studio-white'];
      const count = Math.min(photoCount || 4, 8);
      const anglesToUse = STUDIO_ANGLES.slice(0, count);
      while (anglesToUse.length < count) {
        anglesToUse.push(STUDIO_ANGLES[anglesToUse.length % STUDIO_ANGLES.length]);
      }

      const photoPromises = anglesToUse.map(async (angle) => {
        const prompt = `Generate an ultra-realistic fashion editorial photograph. Model: ${modelPrompt}${modelRefNote}. She is wearing: ${garmentDescription}. Setting: ${location}. Camera: ${angle.prompt}. shot on Canon EOS R5, 8K resolution, Vogue editorial quality, professional fashion photography, natural skin texture. The garment must be exactly as described. Do NOT include: ${negativePrompt}`;
        try {
          const image = await generateImage(apiKey, prompt, garmentImageBase64, modelPhotoUrl);
          return { scenario: location, image, angle: angle.label };
        } catch (err) {
          console.error(`Studio angle ${angle.label} failed:`, err);
          return { scenario: location, image: null, angle: angle.label, error: String(err) };
        }
      });

      const photos = await Promise.all(photoPromises);
      return new Response(
        JSON.stringify({ success: true, mode: 'studio', photos }),
        { headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── MODE: CAMPAIGN — 4 photos, different outfits & locations ────
    if (mode === 'campaign') {
      const photoPromises = CAMPAIGN_COMBOS.map(async (combo) => {
        const prompt = `Generate an ultra-realistic fashion editorial photograph. Model: ${modelPrompt}${modelRefNote}. She is wearing: ${garmentDescription}, ${combo.prompt}. shot on Canon EOS R5 50mm f/1.4, 8K resolution, Vogue editorial quality, cinematic lighting, professional fashion photography, natural skin texture. The main garment must be exactly as described and clearly visible. Do NOT include: ${negativePrompt}`;
        try {
          const image = await generateImage(apiKey, prompt, garmentImageBase64, modelPhotoUrl);
          return { scenario: combo.location, outfit: combo.outfit, image };
        } catch (err) {
          console.error(`Campaign combo ${combo.location} failed:`, err);
          return { scenario: combo.location, outfit: combo.outfit, image: null, error: String(err) };
        }
      });

      const photos = await Promise.all(photoPromises);
      return new Response(
        JSON.stringify({ success: true, mode: 'campaign', photos }),
        { headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid mode. Use: casting, studio, or campaign' }),
      { status: 400, headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-generate-lookbook:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...lookbookCorsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
