import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { cn } from "../lib/utils.ts";
import "../../public/styles/HistorySidebar.css"
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { HistorySidebarProps } from "@/types/types.ts";

export const HistorySidebar:  React.FC<HistorySidebarProps>  = (props:HistorySidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [history, setHistory] = useState<[any]|null>(null);
  const {user, getAccessTokenSilently} = useAuth0();
  
  async function getHistory(){
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch_history`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          email: user?.email
        }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }
  
  useEffect(() => {
    if (user?.email) {
      getHistory();
    }
  }, [user]);


  return (
    <div id="history" className="history flex flex-col bg-neutral-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-yellow-50">
          <Clock size={20} className="mr-2" />
          <h2 className="text-xl font-bold">History</h2>
        </div>
        <Button variant="ghost" size="icon" className="cursor-pointer text-neutral-400 hover:text-neutral-200">
          <Trash2 size={30} />
        </Button>
      </div>
      
      <div className="flex flex-col space-y-2 flex-grow overflow-auto">
        {history?.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "p-4 rounded-lg cursor-pointer border-0 transition-all duration-200",
              hoveredItem === item.id 
                ? "bg-neutral-800 text-neutral-100" 
                : "bg-neutral-700 text-neutral-100"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onClick={()=>props.func_to_fetch_History(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <h3 className="text-l p-0 m-0">{item.title}</h3>
           
          </Card>
        ))}
      </div>
      
      <Button 
        className="w-full newChat mt-4  py-5"
      >
        New Chat
      </Button>
    </div>
  );
};

export default HistorySidebar;