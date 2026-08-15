from fastapi import FastAPI
import google.generativeai as genai
import os
from PIL import Image
import io
import base64

app = FastAPI()

# កំណត់ API Key  সরাসরি
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

@app.post("/api/generate")
async def generate_prompt(data: dict):
    try:
        if not api_key:
            return {"success": False, "error": "GEMINI_API_KEY is not set."}

        user_query = data.get('userQuery', '')
        base64_data = data.get('base64DataOnly', None)

        # ប្រើម៉ូដែល gemini-1.5-flash
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        contents = [user_query]

        if base64_data:
            image_bytes = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_bytes))
            contents.append(image)

        response = model.generate_content(contents)
        return {"success": True, "text": response.text}

    except Exception as e:
        return {"success": False, "error": str(e)}