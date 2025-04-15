from smolagents import ToolCallingAgent,DuckDuckGoSearchTool
from model.load_model import load_model
from live_updates_agent.visit_webpage import visit_webpage

web_agent=ToolCallingAgent(
    tools=[DuckDuckGoSearchTool(),visit_webpage],
    model=load_model(),
    max_steps=10,
    name="web_search_agent",
    description="Runs web searches for you.",
)