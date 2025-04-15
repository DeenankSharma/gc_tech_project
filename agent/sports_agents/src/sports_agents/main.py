import sys
from dotenv import load_dotenv
import os
import warnings

from datetime import datetime

from crew import  SportsChatbotCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    crew = SportsChatbotCrew()
    # Example user input and structured input for player info
    user_input = "Tell me about Virat Kohli's recent performance."
    structured_input = {
        "player_name": "Virat Kohli",
        "sport": "cricket",
        "time_period": "last 5 matches"
    }
    print(crew.handle_user_request(user_input, structured_input))
