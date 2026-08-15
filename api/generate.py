from fastapi import FastAPI, Request
import google.generativeai as genai
import os
from PIL import Image
import io
import base64

app = FastAPI()

# កំណត់ API Key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.post("/api/generate")
async def generate_prompt(request: Request):
    try:
        data = await request.json()
        user_query = data.get('userQuery', '')
        base64_data = data.get('base64DataOnly', None)

        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # ករណីមានរូបភាព
        if base64_data:
            # លុប prefix ប្រសិនបើមាន (ឧទាហរណ៍: data:image/jpeg;base64,)
            if "," in base64_data:
                base64_data = base64_data.split(",")[1]
            
            image_bytes = base64.b64decode(base64_data)
            image = Image.open(io.BytesIO(image_bytes))
            response = model.generate_content([user_query, image])
        else:
            # ករណីគ្មានរូបភាព
            response = model.generate_content(user_query)

        return {"success": True, "text": response.text}

    except Exception as e:
        return {"success": False, "error": str(e)}