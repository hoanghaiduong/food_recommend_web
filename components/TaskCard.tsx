import React from 'react';
import { MoreHorizontal, CheckCircle2, Circle, Target, Tag } from 'lucide-react';
import { Task } from '../types';
import AvatarGroup from './AvatarGroup';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className={`${task.bgColor} p-5 rounded-3xl mb-4 relative group transition-transform hover:scale-[1.02] duration-200`}>
      {/* Header: Tags + Menu */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-white/60 rounded-lg text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              {tag.label}
            </span>
          ))}
        </div>
        <button className="p-1 bg-white/40 rounded-full hover:bg-white/60 transition-colors">
           <MoreHorizontal size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-gray-900 font-semibold text-lg mb-3 leading-tight">
        {task.title}
      </h3>

      {/* Image Content */}
      {task.descriptionType === 'image' && task.imageUrl && (
        <div className="mb-3 rounded-2xl overflow-hidden border-4 border-white/30 shadow-sm relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
             <span className="text-white text-xs font-bold">Preview</span>
          </div>
          <img src={task.imageUrl} alt="Task Preview" className="w-full h-32 object-cover" />
        </div>
      )}

      {/* Checklist Content (Active) */}
      {task.descriptionType === 'checklist' && task.checklistItems && (
        <div className="space-y-2 mb-4">
          {task.checklistItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.completed ? (
                 <div className="bg-brand-green text-white rounded-full p-[2px]">
                   <CheckCircle2 size={12} />
                 </div>
              ) : (
                 <Circle size={16} className="text-gray-400" />
              )}
              <span className={`text-xs ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Completed Checklist Content (Done Column) */}
      {task.descriptionType === 'completed-checklist' && task.checklistItems && (
        <div className="space-y-1 mb-4">
          {task.checklistItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
               <CheckCircle2 size={14} className="text-brand-green fill-lime-100" />
              <span className="text-xs text-gray-700">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      {task.note && (
        <p className="text-xs text-gray-500 mb-3 font-medium italic">
          {task.note}
        </p>
      )}

      {/* Progress Bar */}
      {task.progress !== undefined && (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-medium text-gray-500">Training Progress</span>
                <span className="text-xs font-bold text-gray-700">{task.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${task.progress > 80 ? 'bg-brand-green' : 'bg-gray-700'}`} 
                    style={{ width: `${task.progress}%` }}
                ></div>
            </div>
        </div>
      )}

      {/* Footer: Avatars + Stats */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5">
        <AvatarGroup count={3} />
        <div className="flex items-center gap-3 text-gray-500">
          {task.accuracy !== undefined && (
            <div className="flex items-center gap-1 text-brand-green font-bold bg-white/60 px-2 py-0.5 rounded-md">
              <Target size={14} />
              <span className="text-xs">{task.accuracy}%</span>
            </div>
          )}
          {task.version && (
            <div className="flex items-center gap-1">
              <Tag size={14} className="rotate-45" />
              <span className="text-xs font-medium">{task.version}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
