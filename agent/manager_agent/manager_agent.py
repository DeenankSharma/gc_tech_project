from smolagents import (CodeAgent,ToolCallingAgent,HfApiModel,DuckDuckGoSearchTool,LiteLLMModel)
from model.load_model import load_model
from live_updates_agent.web_agent import web_agent
manager_agent=CodeAgent(
    tools=[],
    model=load_model(),
    managed_agents=[web_agent],
    additional_authorized_imports=["time","numpy","pandas"],
)