import "../../public/styles/ChatSection.css"
import Input from '@mui/joy/Input';
// import IconButton from '@mui/joy/IconButton';
import { ChevronRight } from "lucide-react"

import { Button } from "../components/ui/button"
// import PlayerStatsChart from "./stat_table";

export const ChatSection = () =>{
  return(
    <div id="chat" className="chat flex flex-col bg-neutral-900 p-4">
      <div className="flex gap-2 ">
        {/* <PlayerStatsChart/> */}
      <Input id="chat_prompt" className="w-full chat_input"
  color="neutral"
  placeholder="Let's Chat "
  variant="soft"
/>

<Button  
  className="prompt_btn"
  size="icon"
>
  <ChevronRight className="" />
</Button>
  </div>
  </div>
  )
}