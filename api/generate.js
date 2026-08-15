export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userQuery, base64DataOnly, mimeType, currentAspectRatio } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // ទាញយក API Key ពី Vercel Environment Variables ដោយសុវត្ថិភាព

    if (!apiKey) {
        return res.status(500).json({ error: 'Server API Key not configured' });
    }

    let systemPrompt = `You are a professional Midjourney and Gemini Ultra Realistic Photography Prompt Architect named 尺丨ㄒ卄ㄚ×卂丨✦. Your job is to extract and generate high-end production-ready English prompts for image generation.`;

    let payload = {};
    if (base64DataOnly) {
        payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: userQuery },
                        { inlineData: { mimeType: mimeType, data: base64DataOnly } }
                    ]
                }
            ],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };
    } else {
        payload = {
            contents: [
                {
                    parts: [{ text: userQuery }]
                }
            ],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };
    }

    try {
        // បានកែប្រែឈ្មោះ Model មកជា gemini-1.5-flash ដើម្បីជៀសវាង Error 404
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.status(200).json({ success: true, text: resultText });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
