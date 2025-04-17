import { GEMINI_API_KEY } from "../../constants";
import { GoogleGenAI } from "@google/genai";
import live_scores_cricket from "../api/live_scores_cricket";
import live_scores_football from "../api/live_scores_football";
import live_commentary_cricket from "../api/live_commentary_cricket";
import player_info from "../api/player_info";
import { formatPlayerData } from "../../utils/format_player_data";
import { format_cricket_live_scores } from "../../utils/format_cricket_live_scores";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const beautify=async(response:string)=>{
  const res=await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Convert the following api response into a beautiful, readable, formatted string. You are required to only return me the beautiful, readable, formatted string. 
    For cricket life scores use the following schema: 
    // TypeScript interface for the cricket data
interface CricketMatch {
  // Match identification
  matchNumber: number;
  
  // Tournament details
  tournament: {
    name: string;       // Full tournament name (e.g., "Indian Premier League 2025")
    shortName: string;  // Abbreviated name (e.g., "IPL 2025")
    format: string;     // Match format (e.g., "T20")
  };
  
  // Match status - either completed or upcoming
  status: "completed" | "upcoming";
  
  // Team information
  teams: {
    team1: {
      name: string;       // Full team name (e.g., "Punjab Kings")
      shortName: string;  // Team abbreviation (e.g., "PBKS")
      score: number | null;  // Team's score, null for upcoming matches
      wickets: number | null; // Wickets lost, null if all out or upcoming
      overs: number | null;   // Overs played, null for upcoming matches
    };
    team2: {
      name: string;
      shortName: string;
      score: number | null;
      wickets: number | null;
      overs: number | null;
    };
  };
  
  // Match result information (null for upcoming matches)
  result: {
    winner: string | null;      // Name of winning team
    margin: string | null;      // Margin of victory (e.g., "29 runs", "5 wkts")
    winningMethod: string | null; // How the match was won ("runs" or "wickets")
  } | null;
  
  // Related links (e.g., "fantasy", "table", "schedule")
  links: string[];
}

// Example of the data structure (what you'd receive from your API)
const exampleData: CricketMatch[] = [
  {
    "matchNumber": 10,
    "tournament": {
      "name": "Indian Premier League 2025",
      "shortName": "IPL 2025",
      "format": "T20"
    },
    "status": "completed",
    "teams": {
      "team1": {
        "name": "Punjab Kings",
        "shortName": "PBKS",
        "score": 187,
        "wickets": 6,
        "overs": 20.0
      },
      "team2": {
        "name": "Kolkata Knight Riders",
        "shortName": "KKR",
        "score": 158,
        "wickets": 9,
        "overs": 20.0
      }
    },
    "result": {
      "winner": "Punjab Kings",
      "margin": "29 runs",
      "winningMethod": "runs"
    },
    "links": ["fantasy", "table", "schedule"]
  }
];

    For football live score use the following schema:

    // TypeScript interface for the FIFA football data
interface FifaMatch {
  // Match status (usually "FT" for Full Time)
  status: string;
  
  // First team information
  team1: {
    name: string;       // Team name
    record: {
      wins: number;     // Number of wins
      draws: number;    // Number of draws
      losses: number;   // Number of losses
    };
    score: number;      // Current or final score
  };
  
  // Second team information
  team2: {
    name: string;       // Team name
    record: {
      wins: number;     // Number of wins
      draws: number;    // Number of draws
      losses: number;   // Number of losses
    };
    score: number;      // Current or final score
  };
  
  // Match result - name of winning team, "Draw..." string, or null if match isn't finished
  winner: string | null;
}

// Example of the data structure (what you'd receive from your API)
const exampleData: FifaMatch[] = [
  {
    "status": "FT",
    "team1": {
      "name": "Australia",
      "record": {
        "wins": 5,
        "draws": 2,
        "losses": 1
      },
      "score": 2
    },
    "team2": {
      "name": "Japan",
      "record": {
        "wins": 4,
        "draws": 3,
        "losses": 1
      },
      "score": 1
    },
    "winner": "Australia"
  }
];

    For cricket live commentary use the following schema:

    // TypeScript interface for cricket live commentary data
interface CricketCommentary {
  // Array of commentary lines, arranged in chronological order (most recent first)
  commentaryLines: CommentaryLine[];
  
  // Match information
  matchInfo: {
    url: string;        // URL of the commentary page
    lastUpdated: string; // Timestamp of when the commentary was last fetched
  };
}

// Interface for individual commentary line
interface CommentaryLine {
  text: string;         // The actual commentary text
  timestamp: string;    // Optional timestamp when the commentary was posted
  ballNumber?: string;  // Optional ball number (e.g., "14.2" for 2nd ball of 14th over)
  isWicket?: boolean;   // Flag to indicate if this ball resulted in a wicket
  isBoundary?: boolean; // Flag to indicate if this ball resulted in a boundary (4 or 6)
  runs?: number;        // Number of runs scored on this ball, if applicable
}

// Example of the data structure (what you'd receive from your API)
const exampleData: CricketCommentary = {
  "commentaryLines": [
    {
      "text": "Mahmudullah to Shanto, FOUR, swept away through square leg for a boundary! That's the fifty partnership.",
      "timestamp": "15:42:07",
      "ballNumber": "12.3",
      "isBoundary": true,
      "runs": 4
    },
    {
      "text": "Mahmudullah to Shanto, no run, defended back to the bowler.",
      "timestamp": "15:41:30",
      "ballNumber": "12.2",
      "runs": 0
    },
    {
      "text": "Mahmudullah to Haque, OUT, caught at mid-on! Soft dismissal as he chips it straight to the fielder.",
      "timestamp": "15:40:45",
      "ballNumber": "12.1",
      "isWicket": true,
      "runs": 0
    }
  ],
  "matchInfo": {
    "url": "https://www.cricbuzz.com/cricket-match/live/12345/commentary",
    "lastUpdated": "2025-04-17T15:45:00Z"
  }
};

    For player info use the following schema:

// TypeScript Interfaces for Cricket Player Data

// Main Player Information Schema
interface PlayerInfoResponse {
  bio: string;
  infobox: InfoboxData;
  career_statistics: CareerStatistics;
  url: string;
}

// Infobox data is organized by sections
interface InfoboxData {
  General?: Record<string, string>;
  Personal?: Record<string, string>;
  'Test debut'?: Record<string, string>;
  'ODI debut'?: Record<string, string>;
  'T20I debut'?: Record<string, string>;
  'First-class debut'?: Record<string, string>;
  'List A debut'?: Record<string, string>;
  'T20 debut'?: Record<string, string>;
  'Domestic team information'?: Record<string, string>;
  'International information'?: Record<string, string>;
  [key: string]: Record<string, string> | undefined; // For any other sections
}

// Career Statistics (typically organized by seasons/years)
interface CareerStatistics {
  [season: string]: Record<string, string>;
}

    The response is as follows : ${response}`
  })
  return res
}
const gemini=async (query:string) =>{
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `From this query check for the following conditions:
    1.if the user asks for cricket live scores return live_scores_cricket
    2.if the user asks for football live scores return live_scores_football
    3.if the user asks for cricket live commentary return live_commentary_cricket
    4.if the user asks for player info return player_info along with the name of the player asked as player_info-player_name
    Make sure you only send these one word only as the response in the above scenarios. If in case the user does not ask for the above then start the response with other_response along with your response as follows other_respone-your_response.
    The query is as follows: ${query}
    `,
  });
  console.log(response.text);
  if(response.text?.includes('live_scores_cricket')){
    const result =await live_scores_cricket();
    // const formatted=format_cricket_live_scores(result);
    const formatted = result.replace(/{/g, '\n\n\n').replace(/}/g, '\n\n\n');
    return formatted
    // const res= await beautify(result)
    // console.log(res)
    // return result
  }else if(response.text?.includes('live_scores_football')){
    const result=await live_scores_football();
    // const res= await beautify(result)
    // console.log(res)
    const formatted = result.replace(/{/g, '\n\n\n').replace(/}/g, '\n\n\n');
    return formatted
  }else if(response.text?.includes('live_commentary_cricket')){
    const result=await live_commentary_cricket();
    // const res= await beautify(result)
    // console.log(res)
    const formatted= result.replace(/{/g, '\n\n\n').replace(/}/g, '\n\n\n');
    return formatted
  }else if(response.text?.includes('player_info')){
    const player_name=response.text.split('-')[1]
    const result=await player_info(player_name);
    // console.log(result);
    // console.log(typeof result); 
    // const res= await beautify(result)
    // console.log(res)
    const formatted = formatPlayerData(result);
    return formatted
    // return JSON.parse(result);
  }else{
    const result=response.text?.split("-")[1]
    return result?result:""
  }
}

export default gemini