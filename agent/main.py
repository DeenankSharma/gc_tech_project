from flask import Flask, jsonify,request
import subprocess
import atexit
from scrapers.agent import player_info_api

app = Flask(__name__)

processes = {}

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

if __name__ == '__main__':
    start_all_pipelines()  
    app.run(debug=True)
