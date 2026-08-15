import os
import json
from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
from PIL import Image
import io
import base64

# កំណត់ Gemini API Key ពី Environment Variable របស់ Vercel
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # អានទិន្នន័យ JSON ដែលផ្ញើមកពី Frontend
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            user_query = data.get('userQuery', '')
            base64_data = data.get('base64DataOnly', None)
            mime_type = data.get('mimeType', 'image/jpeg')

            # ជ្រើសរើសម៉ូដែល Gemini 1.5 Flash ຕາມការណែនាំ
            model = genai.GenerativeModel('gemini-1.5-flash')

            content_parts = [user_query]

            # ប្រសិនបើមានរូបភាពយោង ត្រូវបម្លែងវាដើម្បីបញ្ជូនទៅ Vision API
            if base64_data:
                image_bytes = base64.b64decode(base64_data)
                image = Image.open(io.BytesIO(image_bytes))
                content_parts.append(image)

            # ហៅទៅកាន់ Gemini API
            response = model.generate_content(content_parts)
            generated_text = response.text

            # ส่งលទ្ធផលត្រឡប់ទៅ Frontend វិញ
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response_data = {"success": True, "text": generated_text}
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_data = {"success": False, "error": str(e)}
            self.wfile.write(json.dumps(error_data).encode('utf-8'))