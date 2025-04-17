from flask import Flask, jsonify,request
import subprocess
import atexit
import os
import requests
from dotenv import load_dotenv
# from supabase import create_client,Client
from database.mongodb_functions import get_all_chat_sessions,get_title_from_db,get_messages_from_db,store_message_from_db
from scrapers.agent import player_info_api
from speech_to_text.speech_to_text import speech_to_text_api
load_dotenv()
app = Flask(__name__)

processes = {}

supabase_url = os.getenv('SUPABASE_URL')
supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
# client:Client = create_client(supabase_url, supabase_anon_key)

def start_pipeline(name, script_path):
    if name not in processes or processes[name].poll() is not None:
        print(f"Starting {name} pipeline...")
        processes[name] = subprocess.Popen(["python3", script_path])
    else:
        print(f"{name} pipeline already running")

def start_all_pipelines():
    start_pipeline("cricket_scores", "pipeline/cricket/live_scores_cricket.py")
    start_pipeline("football_scores", "pipeline/football/live_scores_fifa.py")
    start_pipeline("cricket_commentary", "pipeline/cricket/live_commentary_cricket.py")

def stop_all_pipelines():
    for name, process in processes.items():
        if process.poll() is None:
            print(f"Stopping {name} pipeline...")
            process.terminate()

atexit.register(stop_all_pipelines)

@app.route('/live_scores/cricket')
def live_scores_cricket():
    try:
        with open("scraped_live_cricket.jsonl", "r") as f:
            return f.read()
    except FileNotFoundError:
        return jsonify({"error": "Cricket data not yet available"}), 404

@app.route('/live_scores/football')
def live_scores_football():
    try:
        with open("scraped_live_fifa.jsonl", "r") as f:
            return f.read()
    except FileNotFoundError:
        return jsonify({"error": "Football data not yet available"}), 404

@app.route('/live_commentary/cricket')
def live_commentary():
    try:
        with open("cricbuzz_commentary.txt", "r") as f:
            return f.read() or "No commentary yet"
    except FileNotFoundError:
        return jsonify({"error": "Commentary not yet available"}), 404
    
@app.route('/player_info')
def player_info():
    try:
        player_name=request.args.get('player_name')
        result=player_info_api(player_name)
        return jsonify(result)
    
    except Exception:
        return jsonify({"error":"Could not fetch player details"}), 400

@app.route('/speech_to_text')
def speech_to_text():
    try:
        audio_url=request.args.get('audio_url')
        response = requests.get(audio_url)
        with open("audio.webm", 'wb') as file:
            file.write(response.content)
            result=speech_to_text_api("audio.webm")
        return result
        
    except Exception as e:
        return jsonify({"error":f"Could not convert speech to text. Error:{e}"}), 400
           
           
@app.route('/api/messages', methods=['POST'])
def add_message():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get('email')
    message = data.get('message')
    is_user = data.get('isUser', True)
    title = data.get('title')
    
    if not email or not message:
        return jsonify({"error": "Email and message are required"}), 400
    
    success = store_message_from_db(email, message, is_user, title)
    
    if success:
        return jsonify({"success": True}), 201
    else:
        return jsonify({"error": "Failed to store message"}), 500

@app.route('/api/messages/<email>', methods=['GET'])
def get_messages(email):
    messages = get_messages_from_db(email)
    return jsonify({"email": email, "messages": messages})

@app.route('/api/title/<email>', methods=['GET'])
def get_title(email):
    title = get_title_from_db(email)
    if title:
        return jsonify({"email": email, "title": title})
    else:
        return jsonify({"error": "No title found for this email"}), 404

@app.route('/api/chats', methods=['GET'])
def get_all_chats():
    chats = get_all_chat_sessions()
    for chat in chats:
        if '_id' in chat:
            chat['_id'] = str(chat['_id'])
    return jsonify({"chats": chats})

if __name__ == '__main__':
    # start_all_pipelines()  
    app.run(debug=True,port=8000)
