from flask import request, jsonify
from app import app

@app.route("/upload", methods=["POST"])
def upload():
    image = request.files.get("image")

    if image is None:
        return jsonify({"error": "画像がありません"}), 400

    return jsonify({
        "message": "画像を受信しました",
        "filename": image.filename
    })