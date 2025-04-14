import { useState } from 'react';
import { Clock, Trash2, MessageSquare } from 'lucide-react';

export const HistorySidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const historyItems = [
    { id: 1, title: 'Travel recommendations', time: '2 hours ago' },
    { id: 2, title: 'Recipe ideas', time: 'Yesterday' },
    { id: 3, title: 'Coding help', time: '3 days ago' },
    { id: 4, title: 'Book suggestions', time: 'Last week' },
  ];
  
  return (
    <div className="flex flex-col h-full bg-neutral-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-yellow-50">
          <Clock size={20} className="mr-2" />
          <h2 className="text-xl font-bold">History</h2>
        </div>
        <button className="text-neutral-400 hover:text-neutral-200">
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="flex flex-col space-y-2">
        {historyItems.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
              hoveredItem === item.id ? 'bg-purple-800' : 'bg-neutral-800'
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              backgroundColor: hoveredItem === item.id ? '#542ABA' : '',
              color: hoveredItem === item.id ? '#FFC5B2' : ''
            }}
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-neutral-400">{item.time}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-auto">
        <button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#F26419' }}
        >
          <MessageSquare size={20} className="mr-2" />
          New Chat
        </button>
      </div>
    </div>
  );
};

export default HistorySidebar;