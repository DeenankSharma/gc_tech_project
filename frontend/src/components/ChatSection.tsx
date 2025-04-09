import "../../public/styles/ChatSection.css"
import Input from '@mui/joy/Input';
// import IconButton from '@mui/joy/IconButton';
import { ChevronRight } from "lucide-react"

import { Button } from "../components/ui/button"

export const ChatSection = () =>{
  return(
    <div id="chat" className="chat flex flex-col bg-neutral-900 p-4">
      <div className="flex gap-2 ">

      <Input className="w-full chat_input"
  color="neutral"
  placeholder="Let's Chat "
  variant="soft"
/>

<Button  
  className="bg-white hover:bg-neutral-800 group border border-black hover:border-white transition-colors duration-300 cursor-pointer"

  size="icon"
>
  <ChevronRight className="text-black group-hover:text-white transition-colors duration-300" />
</Button>
  </div>
  </div>
  )
}