// src/services/pollinationsService.ts


const API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY || '';

export const refineMoodToPrompt = async (mood: string, style: string): Promise<{ prompt: string, colors: string[] }> => {
  const systemPrompt = `You are an art director. Analyze the mood: "${mood}".
  1. Create a detailed, creative artistic image prompt for a "${style}" style.
  2. Generate a palette of 5 hex color codes representing this mood.
  3. IMPORTANT: Return ONLY raw JSON without markdown formatting. 
  Format: {"prompt": "your detailed prompt", "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]}`;

  try {

    const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`, 
      },
      body: JSON.stringify({
        model: 'nova-fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mood }
        ],
        jsonMode: true 
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Text generation failed: ${response.status} - ${errText}`);
    }

    const json = await response.json();
    const rawContent = json.choices[0].message.content;


    const cleanText = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText);

    return {
      prompt: data.prompt || `${mood} in ${style} style`,
      colors: data.colors || ['#ffffff', '#888888', '#444444', '#222222', '#000000']
    };
  } catch (e) {
    console.error("Refinement failed, using fallback:", e);
    return {
      prompt: `${mood} artistic masterpiece, ${style} style, 8k resolution, cinematic lighting`,
      colors: ['#333333', '#555555', '#777777', '#999999', '#bbbbbb']
    };
  }
};

export const generateMoodSketch = async (refinedPrompt: string, style: string): Promise<string> => {
  const seed = Math.floor(Math.random() * 1000000);
  const finalPrompt = encodeURIComponent(`${refinedPrompt}, ${style} style, high quality, 4k`);
  
  let imageUrl = `https://gen.pollinations.ai/image/${finalPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
  
  if (API_KEY) {
    imageUrl += `&key=${API_KEY}`;
  }


  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to generate image: ${response.statusText}`);
  }


  const blob = await response.blob();


  const objectUrl = URL.createObjectURL(blob);

  return objectUrl;
};