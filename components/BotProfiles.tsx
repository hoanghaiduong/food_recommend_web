import React from 'react';
import { Bot, Target, Calendar, Activity, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { BOT_PROFILES_DATA } from '../constants';

const BotProfiles: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar pb-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOT_PROFILES_DATA.map((bot) => (
             <div key={bot.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-brand-lime/30 group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-brand-lime group-hover:text-white transition-all">
                      <Bot size={28} strokeWidth={1.5} />
                   </div>
                   <button className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <MoreHorizontal size={20} />
                   </button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-lime-dark dark:group-hover:text-brand-lime transition-colors">{bot.name}</h3>
                   {/* Status Indicator Dot */}
                   <span className="relative flex h-3 w-3 ml-1">
                      {bot.status === 'Training' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                          bot.status === 'Active' ? 'bg-brand-lime shadow-[0_0_6px_rgba(132,204,22,0.6)]' : 
                          bot.status === 'Training' ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></span>
                   </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-1 leading-relaxed">{bot.description}</p>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 space-y-3 mb-6 transition-colors">
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                         <Activity size={16} />
                         <span className="font-medium">Version</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">{bot.version}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                         <Target size={16} />
                         <span className="font-medium">Accuracy</span>
                      </div>
                      <div className="flex items-center gap-1 text-brand-lime-dark dark:text-brand-lime font-bold">
                          <span>{bot.accuracy}%</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                         <Calendar size={16} />
                         <span className="font-medium">Trained</span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{bot.lastTrained}</span>
                   </div>
                   
                   {/* Progress Bar for Training Status */}
                   {bot.status === 'Training' && (
                       <div className="pt-2">
                           <div className="flex justify-between text-[10px] font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                               <span>Training in progress...</span>
                               <span>78%</span>
                           </div>
                           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                               <div className="bg-yellow-400 h-1.5 rounded-full w-[78%] animate-pulse"></div>
                           </div>
                       </div>
                   )}
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                   <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      bot.status === 'Active' ? 'bg-brand-lime text-white shadow-sm shadow-lime-200 dark:shadow-none' : 
                      bot.status === 'Training' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                   }`}>
                      {bot.status}
                   </span>
                   <button className="flex items-center gap-1 text-sm font-bold text-brand-lime-dark dark:text-brand-lime hover:underline">
                      View
                      <ArrowUpRight size={16} />
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default BotProfiles;