
import React from 'react';
import { MessageSquare, Database, Activity, Zap, MoreHorizontal, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

// --- Mock Data for Charts ---
const TRAFFIC_DATA = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

// Updated Intent Data with Lime and Neutrals
const INTENT_DATA = [
  { name: 'Nutrition Info', value: 45, color: '#84CC16' }, // Lime 500
  { name: 'Meal Plan', value: 30, color: '#D9F99D' }, // Lime 200
  { name: 'Chit-chat', value: 15, color: '#9CA3AF' }, // Gray 400
  { name: 'Errors', value: 10, color: '#FECACA' }, // Red 200
];

// Updated Recent Queries
const RECENT_QUERIES = [
  { id: 1, user: 'Brooklyn S.', query: 'How many calories in Pho Bo?', tag: 'Nutrition', tagColor: 'bg-brand-lime-bg text-brand-lime-dark', time: '2 mins ago', avatar: 'https://picsum.photos/id/65/100/100' },
  { id: 2, user: 'Cody F.', query: 'Suggest a menu for losing weight', tag: 'Suggestion', tagColor: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300', time: '15 mins ago', avatar: 'https://picsum.photos/id/64/100/100' },
  { id: 3, user: 'Esther H.', query: 'Create meal plan for muscle gain', tag: 'Plan', tagColor: 'bg-brand-lime-light text-brand-lime-dark', time: '1 hour ago', avatar: 'https://picsum.photos/id/91/100/100' },
];

const ALERTS = [
  { id: 1, message: 'Vector DB Re-indexing failed', time: '10:00 AM', type: 'error' },
  { id: 2, message: 'New data source added: Gym_Menu_V2', time: '09:30 AM', type: 'success' },
  { id: 3, message: 'High latency detected on API Node 3', time: 'Yesterday', type: 'warning' },
];

// Refined Glass utility class
const GLASS_CARD = "bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 shadow-sm border border-white/40 dark:border-white/10 hover:shadow-lg hover:border-brand-lime/20 dark:hover:border-brand-lime/20 transition-all duration-300";

const DashboardStats: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex-1 h-full overflow-y-auto pr-2 hide-scrollbar">
      <div className="grid grid-cols-12 gap-6 pb-6">
        
        {/* --- Row 1: KPI Cards (Clean & Minimal) --- */}
        <div className={`${GLASS_CARD} col-span-12 md:col-span-6 lg:col-span-3 flex items-start justify-between`}>
           <div>
             <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4 group-hover:bg-brand-lime-bg group-hover:text-brand-lime transition-colors">
                <MessageSquare size={24} />
             </div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Interactions</p>
             <h3 className="text-gray-900 dark:text-white text-3xl font-bold">12,450</h3>
           </div>
           <span className="bg-brand-lime-bg text-brand-lime-dark text-xs font-bold px-2 py-1 rounded-lg">+15%</span>
        </div>

        <div className={`${GLASS_CARD} col-span-12 md:col-span-6 lg:col-span-3`}>
           <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
              <Database size={24} />
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Indexed Data</p>
           <h3 className="text-gray-900 dark:text-white text-3xl font-bold">1,204</h3>
        </div>

        <div className={`${GLASS_CARD} col-span-12 md:col-span-6 lg:col-span-3`}>
           <div className="w-12 h-12 rounded-2xl bg-brand-lime-bg flex items-center justify-center text-brand-lime mb-4">
              <Activity size={24} />
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Uptime Status</p>
           <h3 className="text-gray-900 dark:text-white text-3xl font-bold">99.8%</h3>
        </div>

        <div className={`${GLASS_CARD} col-span-12 md:col-span-6 lg:col-span-3`}>
           <div className="w-12 h-12 rounded-2xl bg-brand-lime-bg flex items-center justify-center text-brand-lime mb-4">
              <Zap size={24} fill="currentColor" />
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Latency</p>
           <h3 className="text-gray-900 dark:text-white text-3xl font-bold">0.4s</h3>
        </div>


        {/* --- Row 2: Charts --- */}
        
        {/* Area Chart - Lime Gradient */}
        <div className={`${GLASS_CARD} col-span-12 lg:col-span-8 flex flex-col h-[350px]`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Traffic Overview & API Usage</h3>
             <button className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
               This Week <ChevronDown size={16} />
             </button>
           </div>
           <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={TRAFFIC_DATA}>
                 <defs>
                   <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#84CC16" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#84CC16" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 
                 />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: isDarkMode ? '#9CA3AF' : '#9CA3AF', fontSize: 12}} 
                    dy={10}
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: isDarkMode ? '#9CA3AF' : '#9CA3AF', fontSize: 12}} 
                 />
                 <Tooltip 
                    contentStyle={{
                        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px', 
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        color: isDarkMode ? '#fff' : '#000'
                     }}
                    itemStyle={{ color: isDarkMode ? '#E5E7EB' : '#374151' }}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#84CC16" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTraffic)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Donut Chart */}
        <div className={`${GLASS_CARD} col-span-12 lg:col-span-4 flex flex-col h-[350px]`}>
           <div className="mb-2">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Intent Distribution</h3>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INTENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke={isDarkMode ? '#1F2937' : '#fff'}
                    strokeWidth={2}
                    strokeOpacity={0.2}
                  >
                    {INTENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px', 
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', 
                        color: isDarkMode ? '#fff' : '#000'
                     }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend below chart */}
              <div className="w-full space-y-2 mt-2">
                 {INTENT_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">{item.name}</span>
                       </div>
                       <span className="font-bold text-gray-800 dark:text-gray-200">{item.value}%</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>


        {/* --- Row 3: Data & Logs --- */}

        {/* Recent Queries Table */}
        <div className={`${GLASS_CARD} col-span-12 lg:col-span-8 flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Queries</h3>
               <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full text-gray-400">
                  <MoreHorizontal size={20} />
               </button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-gray-900/30">
                     <tr>
                        <th className="text-left p-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase rounded-l-xl">User</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Query</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Tag</th>
                        <th className="text-right p-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase rounded-r-xl">Time</th>
                     </tr>
                  </thead>
                  <tbody>
                     {RECENT_QUERIES.map((item) => (
                        <tr key={item.id} className="group hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <img src={item.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                                 <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.user}</span>
                              </div>
                           </td>
                           <td className="p-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-[200px]">{item.query}</p>
                           </td>
                           <td className="p-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.tagColor}`}>
                                 {item.tag}
                              </span>
                           </td>
                           <td className="p-4 text-right">
                              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.time}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
        </div>

        {/* System Alerts List */}
        <div className={`${GLASS_CARD} col-span-12 lg:col-span-4 flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Alerts</h3>
               <button className="text-xs font-bold text-brand-lime-dark dark:text-brand-lime hover:underline">View All</button>
            </div>

            <div className="space-y-4">
               {ALERTS.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-2xl flex items-start gap-3 backdrop-blur-sm border border-transparent ${
                        alert.type === 'error' ? 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' : 
                        alert.type === 'success' ? 'bg-brand-lime-bg/50 dark:bg-brand-lime/10 border-brand-lime-light dark:border-brand-lime/20' : 'bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30'
                    }`}
                  >
                     <div className={`mt-0.5 ${
                        alert.type === 'error' ? 'text-red-500' : 
                        alert.type === 'success' ? 'text-brand-lime' : 'text-yellow-500'
                     }`}>
                        {alert.type === 'error' ? <AlertCircle size={18} /> : 
                         alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                     </div>
                     <div className="flex-1">
                        <p className={`text-sm font-bold mb-1 ${
                           alert.type === 'error' ? 'text-red-900 dark:text-red-400' : 
                           alert.type === 'success' ? 'text-gray-900 dark:text-gray-200' : 'text-yellow-900 dark:text-yellow-400'
                        }`}>
                           {alert.message}
                        </p>
                        <span className={`text-xs font-medium ${
                            alert.type === 'error' ? 'text-red-700/60 dark:text-red-400/60' : 
                            alert.type === 'success' ? 'text-brand-lime-dark/80 dark:text-brand-lime/80' : 'text-yellow-700/60 dark:text-yellow-400/60'
                        }`}>
                           {alert.time}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardStats;
