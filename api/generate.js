export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { userQuery, base64DataOnly, mimeType, currentAspectRatio } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'Missing GEMINI_API_KEY environment variable on Vercel.' });
        }

        const parts = [];
        if (base64DataOnly) {
            parts.push({
                inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: base64DataOnly
                }
            });
        }
        parts.push({ text: userQuery || "Analyze image and generate realistic photography prompt." });

        const payload = {
            contents: [{ parts }]
        };

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            let generatedText = data.candidates[0].content.parts[0].text;
            if (currentAspectRatio && !generatedText.includes(currentAspectRatio)) {
                generatedText += ` ${currentAspectRatio}`;
            }
            return res.status(200).json({ success: true, text: generatedText });
        } else {
            console.error('Gemini API Response Error:', JSON.stringify(data));
            return res.status(500).json({ success: false, error: data.error?.message || 'Failed to generate prompt from Gemini API.' });
        }

    } catch (error) {
        console.error('Serverless Function Error:', error);
        return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
}
