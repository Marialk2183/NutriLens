export const analyzeFood = async (imageBase64) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please add VITE_GEMINI_KEY to your .env file.');
  }

  const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,    
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this food. You MUST return ONLY a raw JSON object. Use numbers ONLY for macros. Schema: { \"foodName\": \"Name\", \"calories\": 300, \"protein\": 10, \"carbs\": 30, \"fat\": 15, \"healthScore\": 85, \"verdict\": \"Healthy choice.\", \"tip\": \"Add greens.\", \"allergens\": [\"None\"] }" },
            { inlineData: { mimeType: "image/jpeg", data: base64Data }}
          ]
        }],
        generationConfig: {
            responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini API Check Failed:", errorBody);
    throw new Error(`Gemini 404/Error: Check your API Key configuration. Google says: ${errorBody}`);
  }

  const data = await response.json();
  let text = data.candidates[0].content.parts[0].text;
  
  try {
    // Strip markdown formatting if Gemini hallucinates it despite the MIME type instruction
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(text);
    
    // Safety fallback to ensure numbers are numbers and not strings like "20g"
    return {
        ...result,
        calories: Number(result.calories) || 0,
        protein: Number(String(result.protein).replace(/[^0-9.]/g, '')) || 0,
        carbs: Number(String(result.carbs).replace(/[^0-9.]/g, '')) || 0,
        fat: Number(String(result.fat).replace(/[^0-9.]/g, '')) || 0,
        healthScore: Number(result.healthScore) || 50
    };
  } catch (error) {
    console.error("Error parsing Gemini JSON response:", text);
    throw new Error('Failed to parse analysis result properly. Please try scanning again.');
  }
};

export const chatWithGemini = async (message, history = []) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please add VITE_GEMINI_KEY to your .env file.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,    
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "System Context: You are NutriLens AI, a friendly, ultra-short, highly energetic health and nutrition coach chatbot built into the NutriLens app. Formality is low, emojis are high! Reply very briefly.\n\nUser Message: " + message }] }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini 404/Error: Check your API Key configuration. Google says: ${errorBody}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_SIZE = 800;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};
