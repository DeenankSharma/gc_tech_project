import { GEMINI_API_KEY } from "../../constants";
import { GoogleGenAI } from "@google/genai";
import live_scores_cricket from "../api/live_scores_cricket";
import live_scores_football from "../api/live_scores_football";
import live_commentary_cricket from "../api/live_commentary_cricket";
import player_info from "../api/player_info";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
    const result=await live_scores_cricket();
    return result;
  }else if(response.text?.includes('live_scores_football')){
    const result=await live_scores_football();
    return result;
  }else if(response.text?.includes('live_commentary_cricket')){
    const result=await live_commentary_cricket();
    return result;
  }else if(response.text?.includes('player_info')){
    const player_name=response.text.split('-')[1]
    const result=await player_info(player_name);
    return result;
  }else{
    return response.text;
  }
}

export default gemini