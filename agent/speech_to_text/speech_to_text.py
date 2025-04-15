import whisper
from smolagents import tool

@tool
def speech_to_text(filename):
    model=whisper.load_model("base")
    result=model.transcribe(filename)
    return result["text"]
