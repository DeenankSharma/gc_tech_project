from smolagents import HfApiModel,LiteLLMModel
import os

model_id="ollama_chat/Mistral-7B-Instruct-v0.3"

def load_model():
    model = LiteLLMModel(model_id=model_id,api_key="ollama")
    return model
