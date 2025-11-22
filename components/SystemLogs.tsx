
import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Copy,
  Terminal
} from 'lucide-react';
import { DataTableToolbar, FacetedFilter, DataTablePagination } from './TableComponents';

// Types
type LogLevel = 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
type LogSource = 'API_GATEWAY' | 'VECTOR_DB' | 'AUTH_SERVICE' | 'SYSTEM' | 'CLIENT';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  latency: string;
  payload: any;
  stackTrace?: string;
}

// Mock Data
const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log_x8d92m',
    timestamp: '10:42:15.332',
    level: 'ERROR',
    source: 'VECTOR_DB',
    message: 'Connection timed out while indexing batch #402',
    latency: '5002ms',
    payload: {
      collection: 'gym_food_v2',
      batchSize: 500,
      retryCount: 3,
      host: 'qdrant-cluster-01:6333',
      error_code: 'ETIMEDOUT'
    },
    stackTrace: `Error: Connection timed out\n    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)`
  },
  {
    id: 'log_a7b23x',
    timestamp: '10:41:58.120',
    level: 'SUCCESS',
    source: 'API_GATEWAY',
    message: 'POST /api/v1/chat/completion - 200 OK',
    latency: '450ms',
    payload: { status: 200, client_ip: '192.168.1.45' }
  },
  {
    id: 'log_w9c44p',
    timestamp: '10:41:22.005',
    level: 'WARNING',
    source: 'SYSTEM',
    message: 'Memory usage exceeded 85% threshold',
    latency: '-',
    payload: { heap_used: '4.2GB' }
  },
  {
    id: 'log_k2l55m',
    timestamp: '10:40:11.882',
    level: 'INFO',
    source: 'AUTH_SERVICE',
    message: 'User session refreshed: brooklyn.simmons',
    latency: '120ms',
    payload: { user_id: 'u_8823' }
  },
  {
    id: 'log_z1x99q',
    timestamp: '10:38:45.221',
    level: 'ERROR',
    source: 'API_GATEWAY',
    message: 'Rate limit exceeded for API Key ending in ...x922',
    latency: '12ms',
    payload: { limit: 1000 }
  },
  {
    id: 'log_h4j55n',
    timestamp: '10:38:10.400',
    level: 'SUCCESS',
    source: 'VECTOR_DB',
    message: 'Successfully retrieved 10 nearest neighbors',
    latency: '85ms',
    payload: { top_k: 10 }
  },
   {
    id: 'log_m8n77b',
    timestamp: '10:35:22.998',
    level: 'WARNING',
    source: 'API_GATEWAY',
    message: 'Slow query detected on /api/analytics',
    latency: '2400ms',
    payload: { execution_time: '2350ms' }
  }
];

const SystemLogs: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter Logic
  const filteredLogs = useMemo(() => {
      return MOCK_LOGS.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              log.id.includes(searchQuery);
        const matchesLevel = levelFilter.length === 0 || levelFilter.includes(log.level);
        const matchesSource = sourceFilter.length === 0 || sourceFilter.includes(log.source);
        return matchesSearch && matchesLevel && matchesSource;
      });
  }, [searchQuery, levelFilter, sourceFilter]);

  // Pagination
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  // Helpers for styling
  const getLevelBadge = (level: LogLevel) => {
    switch(level) {
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/30">
            <AlertOctagon size={12} /> ERROR
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/30">
            <AlertTriangle size={12} /> WARNING
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30">
            <Info size={12} /> INFO
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-lime-bg text-brand-lime-dark dark:bg-brand-lime/20 dark:text-brand-lime border border-brand-lime-light dark:border-brand-lime/30">
            <CheckCircle2 size={12} /> SUCCESS
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden relative">
      {/* Main Content (Table) */}
      <div className="flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 transition-colors overflow-hidden">
        
        {/* Standardized Toolbar */}
        <DataTableToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search logs..."
            filters={
                <>
                    <FacetedFilter 
                        title="Level" 
                        options={[
                            { label: 'Error', value: 'ERROR' },
                            { label: 'Warning', value: 'WARNING' },
                            { label: 'Info', value: 'INFO' },
                            { label: 'Success', value: 'SUCCESS' },
                        ]}
                        selectedValues={levelFilter}
                        onChange={setLevelFilter}
                    />
                    <FacetedFilter 
                        title="Source" 
                        options={[
                            { label: 'Vector DB', value: 'VECTOR_DB' },
                            { label: 'API Gateway', value: 'API_GATEWAY' },
                            { label: 'System', value: 'SYSTEM' },
                        ]}
                        selectedValues={sourceFilter}
                        onChange={setSourceFilter}
                    />
                </>
            }
        />

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans pl-6">Timestamp</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Level</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Source</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans w-1/3">Message</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans text-right">Latency</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans"></th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-gray-50 dark:divide-gray-800">
              {paginatedLogs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`
                    cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
                    ${selectedLog?.id === log.id ? 'bg-brand-lime-bg dark:bg-brand-lime/5' : ''}
                  `}
                >
                  <td className="p-4 pl-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">{getLevelBadge(log.level)}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{log.source}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 truncate max-w-xs">{log.message}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-right">{log.latency}</td>
                  <td className="p-4 text-right pr-6">
                    <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <DataTablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={totalItems}
        />
      </div>

      {/* Slide-over Detail Panel */}
      {selectedLog && (
        <div className="absolute inset-y-0 right-0 w-[500px] bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 z-20 animate-[slideInRight_0.2s_ease-out]">
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white font-mono">{selectedLog.id}</h3>
                        {getLevelBadge(selectedLog.level)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{selectedLog.timestamp} via {selectedLog.source}</p>
                </div>
                <button 
                   onClick={() => setSelectedLog(null)}
                   className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Message Section */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Log Message</label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                        {selectedLog.message}
                    </div>
                </div>

                {/* JSON Payload */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Payload Details</label>
                         <button className="text-[10px] font-bold text-brand-lime-dark dark:text-brand-lime flex items-center gap-1 hover:underline">
                             <Copy size={10} /> Copy JSON
                         </button>
                    </div>
                    <div className="bg-[#0F172A] rounded-xl p-4 overflow-x-auto border border-gray-700 relative group">
                         <pre className="text-xs font-mono text-blue-300 leading-5">
                             {JSON.stringify(selectedLog.payload, null, 2)}
                         </pre>
                    </div>
                </div>

                {/* Stack Trace (If Error) */}
                {selectedLog.level === 'ERROR' && selectedLog.stackTrace && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <Terminal size={14} className="text-red-500" />
                             <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Stack Trace</label>
                        </div>
                        <div className="bg-black rounded-xl p-4 overflow-x-auto border border-red-900/30 shadow-inner">
                             <pre className="text-[11px] font-mono text-green-500 leading-loose whitespace-pre-wrap font-medium">
                                 {selectedLog.stackTrace}
                             </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
