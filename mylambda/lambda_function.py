import html
import requests
from flask import Flask, render_template, request
from flask_cors import CORS
from serverless_wsgi import handle_request

app = Flask(__name__)
app.secret_key = 'ipc-llm-ocr'
CORS(app)

@app.route('/map/new')
def newMap():
    address = request.args.get('address', '')  # クエリパラメータを取得
    return render_template('index.html', address=address)

@app.route('/map/add')
def addMap():
    address = request.args.get('address', '')  # クエリパラメータを取得
    return address


def lambda_handler(event, context):
    return handle_request(app, event, context)
