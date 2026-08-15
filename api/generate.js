// api/generate.js
// Vercel Serverless Function — ហៅទៅកាន់ Gemini API (Vision) ដោយសុវត្ថិភាព
// API key ត្រូវបានលាក់នៅ server-side ដោយប្រើ Environment Variable ឈ្មោះ GEMINI_API_KEY

export default async function handler(req, res) {
  // អនុញ្ញាតតែ POST method ប៉ុណ្ណោះ
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY មិនទាន់បានកំណត់នៅក្នុង Vercel Environment Variables ទេ'
    });
  }

  try {
    const { userQuery, base64DataOnly, mimeType } = req.body;

    if (!userQuery) {
      return res.status(400).json({ success: false, error: 'Missing userQuery' });
    }

    // ថ្នាក់ Model — អាចប្តូរបានតាមរយៈ Environment Variable ឈ្មោះ GEMINI_MODEL
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // សាងសង់ parts សម្រាប់ស្នើសុំ៖ text + (រូបភាព បើមាន)
    const parts = [{ text: userQuery }];
    if (base64DataOnly) {
      parts.push({
        inline_data: {
          mime_type: mimeType || 'image/png',
          data: base64DataOnly
        }
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      return res.status(geminiResponse.status).json({
        success: false,
        error: data?.error?.message || 'Gemini API request failed'
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        success: false,
        error: 'Gemini មិនបានត្រឡប់លទ្ធផលអត្ថបទមកវិញទេ (ប្រហែលជាត្រូវបានទប់ស្កាត់ដោយ Safety Filter)'
      });
    }

    return res.status(200).json({ success: true, text });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
