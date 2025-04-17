import "../../public/styles/ChatSection.css"
import Input from '@mui/joy/Input';
import { ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { useState } from "react";

export const ChatSection = () =>{
 
  const [query,setQuery]= useState<string>('')


  return(
    <div id="chat" className="chat flex flex-col bg-neutral-900 p-4">
      <div className="flex gap-2 ">

      <Input id="chat_prompt" className="w-full chat_input"
  color="neutral" value={query} onChange={(e)=>setQuery(e.target.value
  )}
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