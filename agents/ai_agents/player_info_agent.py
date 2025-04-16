from smolagents import CodeAgent,LiteLLMModel

model= LiteLLMModel(
  model_id="ollama_chat/deepseek-r1:1.5b",
  api_key="ollama"
)



agent = CodeAgent(tools=[],
                  model=model,
                  name='text_summarizer',
                   description=f'''
                you are an expert summarizer, which takes in a large amount of chunk and outputs as short summary of it, without excluding necessary details. The tone is fun-like and full of curiosity. your output should be a short note.
        '''
                  ) 

    

def summarize(text):
    response = agent.run(text)
    return response