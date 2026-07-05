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

#model = genai.GenerativeModel("gemini-2.5-flash")

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
    あなたは忘れ物管理システムの優秀な仕分けAIです。
    与えられた画像に写っている「主な忘れ物」を分析し、以下の2つの情報を日本語で抽出してください。

    1. label: 物の名前（例：傘、スマートフォン、鍵、財布など）
    2. feature: その物の特徴。色、柄、素材、状態など（例：青色のビニール傘、透明なケース付き、赤い革製など）

    出力は必ず以下のJSON形式のみとし、余計な挨拶や解説のテキストは一切含めないでください。

    {
        "label": "物の名前",
        "feature": "特徴の詳細"
    }
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, image],
        config={"response_mime_type": "application/json"}
    )

    text = response.text.strip()

    result = json.loads(text)

    return jsonify(result)