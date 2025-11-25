import os
import google.generativeai as genai
from dotenv import load_dotenv
import sys

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables.", file=sys.stderr)

genai.configure(api_key=api_key)

# Using the latest 2.0 Flash model
model = genai.GenerativeModel('gemini-2.0-flash')

def generate_response(prompt: str) -> str:
    try:
        print(f"Generating response for prompt: {prompt[:50]}...", file=sys.stderr)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating response: {str(e)}", file=sys.stderr)
        return f"Error generating response: {str(e)}"

def generate_json_response(prompt: str) -> str:
    """
    Forces the model to return JSON.
    """
    json_prompt = f"{prompt}\n\nReturn ONLY a valid JSON object. Do not include markdown formatting like ```json."
    try:
        print(f"Generating JSON for prompt: {prompt[:50]}...", file=sys.stderr)
        response = model.generate_content(json_prompt)
        text = response.text.strip()
        # Cleanup if model adds markdown
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()
    except Exception as e:
        print(f"Error generating JSON: {str(e)}", file=sys.stderr)
        return "{}"
