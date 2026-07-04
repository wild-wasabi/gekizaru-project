from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Reactからのアクセスを許可

@app.route("/")
def home():
    return {"message": "Flask is running!"}

if __name__ == "__main__":
    app.run(debug=True)