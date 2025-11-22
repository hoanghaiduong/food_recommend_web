import React from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { Column } from '../types';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  data: Column[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ data }) => {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar">
      <div className="flex gap-6 min-w-[1200px] h-full pb-4">
        {data.map((column) => (
          <div key={column.id} className="flex-1 flex flex-col min-w-[300px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 pr-2 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-brand-neon text-xs">▶</span>
                <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
                <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {column.tasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                  <Plus size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Cards Container */}
            <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar pb-10">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
