export const generateImage = async ({ prompt, niche, stylePreset, layout, palette, aspectRatio, saturation }: any) => {
  const validAspectRatios = ['16:9', '9:16', '1:1'];
  const safeAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

  const nicheModifiers: Record<string, string> = {
    'General':       "Strong face-forward composition, single clear focal point, high-contrast primary colors, genuine emotional expression, bold curiosity-gap visual.",
    'Gaming':        "Dynamic lighting, red/green danger indicators, extreme zooms on mid-action reaction faces, short exclamation text.",
    'Finance':       "Large dollar amounts or percentages as the absolute focal point. Green for gains, red for losses. Clean, professional aesthetic with a subtle shock factor.",
    'Fitness':       "Transformation compositions (before/after split screens), determination/success expressions, bold warm colors, action text.",
    'Education':     "Clarity over cleverness. Bold blue/yellow contrast (Trust + Energy). Step indicators, clean and organized layout.",
    'Entertainment': "Diagonal compositions to create visual tension, heavily saturated warm colors, maximum facial emotion.",
    'Tech':          "The product is the hero, heavily sharpened and in ultra-focus. Human subject in the background with soft focus. Clean studio lighting, sleek Apple-style color grading.",
    'Food':          "Hero food close-up with dramatic steam and texture, extreme macro food photography, warm golden lighting, mouth-watering glossy presentation.",
  };

  const stylePresets: Record<string, string> = {
    'Adventure':   "Hyper-saturated action shot, extreme wide-angle lens distortion, vibrant lighting, volumetric fog, high-energy composition.",
    'Documentary': "Dramatic moody lighting, cinematic mystery aesthetic, dark vignetting, high local contrast, film grain, blurred storytelling background.",
    'Review':      "Minimalist high-tech aesthetic, ultra-sharp macro focus on product, clean studio lighting, soft shadows, professional tech-enthusiast vibe.",
    'Minimalist':  "Clean composition, minimal elements, strong negative space, single focal point, elegant typography.",
    'Viral':       "Extreme shock/disbelief expression, over-saturated near-cartoon colors, bold red and yellow callout arrows, chaotic meme-aware composition, maximum curiosity gap visual.",
    'Tutorial':    "Clean organized layout with numbered step indicators, before/after split framing, directional arrows and callouts, warm approachable professional lighting.",
  };

  const colorPairings: Record<string, string> = {
    'Vibrant':       'Yellow+Black (Urgency)',
    'Minimalist':    'Blue+White (Trust)',
    'Dark Mode':     'Red+White (Drama)',
    'High Contrast': 'Orange+Dark Blue (Excitement)',
  };

  const layoutModifiers: Record<string, string> = {
    'Split Screen':      "Perfect 50/50 split composition with a strong center dividing line, contrasting left vs right visual elements telling opposite sides of a story.",
    'Centered Subject':  "Subject perfectly centered with symmetrical negative space on both sides, strong center-weighted dominant composition.",
    'Grid':              "Multi-panel 2x2 or 3x1 grid layout, each cell contains a distinct visual element, grid structure is clearly visible and organized.",
    'Default':           "",
  };

  const enhancedPrompt = `${prompt} | NICHE: ${nicheModifiers[niche] || nicheModifiers['General']} | STYLE: ${stylePresets[stylePreset] || ''} | LAYOUT: ${layoutModifiers[layout] || ''} | PALETTE: ${colorPairings[palette] || 'Yellow+Black (Urgency)'} | TECHNICAL: Cinematic lighting, professional photography, ${saturation || 100}% saturation | CTR: Bold readable text with 3D depth effect, clear strong emotional expression, high contrast foreground vs background`;

  const minimaxApiKey = process.env.MINIMAX_API_KEY;
  if (!minimaxApiKey) {
    throw new Error('MINIMAX_API_KEY environment variable is required for image generation');
  }

  const response = await fetch("https://api.minimax.io/v1/image_generation", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${minimaxApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "image-01",
      prompt: enhancedPrompt,
      aspect_ratio: safeAspectRatio,
      response_format: "url",
      n: 1,
      prompt_optimizer: true
    }),
    signal: AbortSignal.timeout(60_000)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Image generation failed (${response.status})`);
  }

  const data: any = await response.json();

  if (data?.base_resp?.status_code && data.base_resp.status_code !== 0) {
    throw new Error(`Image generation failed: ${data.base_resp.status_msg}`);
  }

  const rawUrl =
    data?.data?.image_urls?.[0] ||
    data?.data?.[0]?.url ||
    data?.images?.[0]?.url ||
    data?.output_image_urls?.[0];

  if (!rawUrl) {
    console.error("Unexpected Minimax response shape:", JSON.stringify(data));
    throw new Error("No image URL returned from image generation service");
  }

  const httpsUrl = rawUrl.replace(/^http:\/\//, 'https://');

  const imgResponse = await fetch(httpsUrl, { signal: AbortSignal.timeout(30_000) });
  if (!imgResponse.ok) throw new Error("Failed to fetch generated image");
  const imgBuffer = await imgResponse.arrayBuffer();
  const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg';
  const base64 = Buffer.from(imgBuffer).toString('base64');

  return `data:${mimeType};base64,${base64}`;
};
