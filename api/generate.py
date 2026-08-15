from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
from PIL import Image
import io
import base64

app = FastAPI()

# យក API Key ពី Environment Variables
api_key = os.environ.get("GEMINI_API_KEY")

@app.post("/api/generate")
async def generate_prompt(data: dict):
    try:
        if not api_key:
            return {"success": False, "error": "GEMINI_API_KEY is not set in environment variables."}

        # បង្កើត Client តាមស្ដង់ដារថ្មី
        client = genai.Client(api_key=api_key)

        user_query = data.get('userQuery', '')
        base64_data = data.get('base64DataOnly', None)

        contents = [user_query]

        # ប្រសិនបើមានរូបភាព បម្លែងវាជា Part
        if base64_data:
            image_bytes = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_bytes))
            contents.append(image)

        # ហៅប្រើម៉ូដែល gemini-2.5-flash ឬ gemini-1.5-flash តាមតម្រូវការ
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents
        )

        return {"success": True, "text": response.text}

    except Exception as e:
        return {"success": False, "error": str(e)}