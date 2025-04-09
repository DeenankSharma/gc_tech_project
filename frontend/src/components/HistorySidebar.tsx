import React from "react";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { cn } from "../lib/utils.ts";
import { HistoryItem } from "@/types/types.ts";
import "../../public/styles/HistorySidebar.css"

export const HistorySidebar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<number | null>(null);
  
  const historyItems: HistoryItem[] = [
    { id: 1, title: "Travel recommendations", time: "2 hours ago" },
    { id: 2, title: "Recipe ideas", time: "Yesterday" },
    { id: 3, title: "Coding help", time: "3 days ago" },
    { id: 4, title: "Book suggestions", time: "Last week" },
  ];
  
  return (
    <div id="history" className="history flex flex-col bg-neutral-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-yellow-50">
          <Clock size={20} className="mr-2" />
          <h2 className="text-xl font-bold">History</h2>
        </div>
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-200">
          <Trash2 size={20} />
        </Button>
      </div>
      
      <div className="flex flex-col space-y-2 flex-grow overflow-auto">
        {historyItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "p-4 rounded-lg cursor-pointer border-0 transition-all duration-200",
              hoveredItem === item.id 
                ? "bg-[#542ABA] text-[#FFC5B2]" 
                : "bg-neutral-800 text-neutral-100"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className={cn(
              "text-sm", 
              hoveredItem === item.id ? "text-[#FFC5B2]/70" : "text-neutral-400"
            )}>
              {item.time}
            </p>
          </Card>
        ))}
      </div>
      
      <Button 
        className="w-full newChat mt-4  py-6"

      >
        New Chat
      </Button>
    </div>
  );
};

export default HistorySidebar;