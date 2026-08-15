export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { image } = JSON.parse(req.body);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Extract prompt text from this image for Midjourney, be realistic and detailed." }, 
            { inline_data: { mime_type: "image/jpeg", data: image } }]}]
        })
    });
    const data = await response.json();
    res.status(200).json({ prompt: data.candidates[0].content.parts[0].text });
}
