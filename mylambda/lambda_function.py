import html
import requests
from flask import Flask, render_template, request, Response, make_response
from flask_cors import CORS
from serverless_wsgi import handle_request
import datetime
import jwt
import json
from flask import jsonify

app = Flask(__name__)
app.secret_key = 'ipc-llm-ocr'
CORS(app)

SECRET_KEY = "secret"

@app.route('/map')
def newMap():
    address = request.args.get('address', '')  # クエリパラメータを取得
    return render_template('index.html', address=address)

@app.route('/get_jwt')
def get_jwt_user():
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {
        "user": "test_user",
        "role": "admin",
        "exp": int(expiration.timestamp())
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

@app.route("/auth_jwt", methods=["POST"])
def auth_jwt_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "missing token"}), 401

    token = auth_header.split(" ")[1]
    addresses = ["二十一世紀美術館", "金沢駅"]
    addressToNameDict = {"二十一世紀美術館": "二十一世紀美術館", "金沢駅": "金沢駅"}

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"user": decoded["user"], "role": decoded["role"], "addresses": addresses, "addressToNameDict": addressToNameDict})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "invalid token"}), 401


def lambda_handler(event, context):
    return handle_request(app, event, context)
