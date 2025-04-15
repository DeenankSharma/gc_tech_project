from crewai import Agent, Crew, Task, Process
from crewai.project import CrewBase, agent,task, crew
from crewai_tools import WebsiteSearchTool,SerplyWebSearchTool,BraveSearchTool

@CrewBase
class SportsChatbotCrew:
    
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"
 
        
    @agent
    def sports_data_collector(self) -> Agent:
            return Agent(
                config=self.agents_config['sports_data_collector'],
                verbose=True,
                tools=[WebsiteSearchTool,SerplyWebSearchTool,BraveSearchTool],
                llm='gemini/gemini-1.5-pro'
            )
    
    @task
    def fetch_player_info_task(self) -> Task:
        return Task(
            config=self.agents_config['fetch_player_info']
        )
        
        
        
    # @task
    # def live_match_updates_task():
        

    # @task
    # def cricket_tournament_standings_task():
        