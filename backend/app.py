from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from PIL import Image
from io import BytesIO
import json

from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)
CORS(app)


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json
    image_url = data["image"]

    image = Image.open(
        BytesIO(
            requests.get(image_url).content
        )
    )

    prompt = """
    ...
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, image]
    )

    text = response.text.replace("```json", "").replace("```", "").strip()

    result = json.loads(text)

    return jsonify(result)