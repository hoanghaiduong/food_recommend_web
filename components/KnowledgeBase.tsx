
import React, { useState } from 'react';
import { 
    CloudUpload, 
    FileText, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Search, 
    Flame, 
    Beef, 
    Wheat, 
    Droplets, 
    Edit2, 
    AlertTriangle, 
    Tag, 
    MoreHorizontal,
    Trash2,
    BarChart3,
    ArrowRight,
    Eye,
    RefreshCw,
    Database,
    FileType,
    FileJson,
    FileSpreadsheet,
    LayoutGrid,
    List,
    ArrowLeft,
    Folder,
    FolderOpen,
    Download,
    Plus,
    ChevronRight,
    Home
} from 'lucide-react';

// --- Types ---

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    tags: string[];
    sanityCheck?: string; // Error message if data looks weird
}

interface FolderItem {
    id: string;
    name: string;
    count: number;
}

interface DataSource {
    id: string;
    name: string;
    folderId: string; // Linked to FolderItem
    type: 'JSON' | 'PDF' | 'CSV' | 'TXT';
    status: 'Synced' | 'Indexing' | 'Error';
    size: string;
    chunks: number;
    progress: number; // 0-100
    uploadDate: string;
}

interface SimulationResult {
    id: string;
    foodName: string;
    chunkText: string;
    similarity: number; // 0-1
    rerankScore: number; // 0-1
}

// --- Mock Data ---

const FOLDERS: FolderItem[] = [
    { id: 'recipes', name: 'Vietnamese Recipes', count: 3 },
    { id: 'supplements', name: 'Protein Supplements', count: 2 },
    { id: 'vegan', name: 'Vegan Sources', count: 1 },
    { id: 'raw', name: 'Raw Ingredients', count: 1 },
];

const DATA_SOURCES: DataSource[] = [
    { id: 'f1', folderId: 'recipes', name: 'menu_pho_bo.json', type: 'JSON', status: 'Synced', size: '1.2 MB', chunks: 45, progress: 100, uploadDate: '10 mins ago' },
    { id: 'f2', folderId: 'supplements', name: 'gym_supplements_v2.pdf', type: 'PDF', status: 'Synced', size: '4.5 MB', chunks: 128, progress: 100, uploadDate: '2 hours ago' },
    { id: 'f3', folderId: 'raw', name: 'raw_chicken_suppliers.csv', type: 'CSV', status: 'Error', size: '12.8 MB', chunks: 0, progress: 15, uploadDate: 'Yesterday' },
    { id: 'f4', folderId: 'vegan', name: 'vegan_alternatives_list.txt', type: 'TXT', status: 'Indexing', size: '0.5 MB', chunks: 12, progress: 65, uploadDate: 'Just now' },
    { id: 'f5', folderId: 'recipes', name: 'hanoi_street_food.json', type: 'JSON', status: 'Synced', size: '2.1 MB', chunks: 89, progress: 100, uploadDate: '2 days ago' },
    { id: 'f6', folderId: 'supplements', name: 'macro_cheat_sheet.pdf', type: 'PDF', status: 'Synced', size: '3.2 MB', chunks: 94, progress: 100, uploadDate: '3 days ago' },
    { id: 'f7', folderId: 'recipes', name: 'banh_mi_fillings.csv', type: 'CSV', status: 'Synced', size: '0.8 MB', chunks: 22, progress: 100, uploadDate: '5 days ago' },
];

const FOOD_ITEMS: FoodItem[] = [
    { 
        id: 'i1', 
        name: 'Phở Bò Tái (Rare Beef Pho)', 
        calories: 450, 
        protein: 28, 
        carbs: 60, 
        fat: 12, 
        tags: ['Breakfast', 'High Carb'] 
    },
    { 
        id: 'i2', 
        name: 'Ức Gà Luộc (Boiled Chicken Breast)', 
        calories: 165, 
        protein: 31, 
        carbs: 0, 
        fat: 3.6, 
        tags: ['Cutting', 'High Protein'] 
    },
    { 
        id: 'i3', 
        name: 'Bơ Sáp (Avocado - Large)', 
        calories: 320, 
        protein: 4, 
        carbs: 17, 
        fat: 29, 
        tags: ['Healthy Fat', 'Vegan'] 
    },
    { 
        id: 'i4', 
        name: 'Sữa Tươi Trân Châu Đường Đen', 
        calories: 650, 
        protein: 2, 
        carbs: 120, 
        fat: 18, 
        tags: ['Cheat Meal', 'Sugar Alert'],
        sanityCheck: 'Low Protein Alert - Verify Data' 
    },
    { 
        id: 'i5', 
        name: 'Whey Protein Isolate (1 Scoop)', 
        calories: 120, 
        protein: 25, 
        carbs: 2, 
        fat: 1, 
        tags: ['Supplement', 'Post-Workout'] 
    }
];

const SIMULATION_RESULTS: SimulationResult[] = [
    { id: 's1', foodName: 'Ức Gà Luộc', chunkText: 'Chicken breast is a lean source of protein, containing 31g protein per 100g serving...', similarity: 0.94, rerankScore: 0.98 },
    { id: 's2', foodName: 'Whey Protein', chunkText: 'Isolate whey absorbs quickly, ideal for post-workout recovery. Contains minimal fats...', similarity: 0.88, rerankScore: 0.91 },
    { id: 's3', foodName: 'Phở Bò', chunkText: 'Beef in Pho provides a moderate amount of protein, though high sodium content should be noted...', similarity: 0.72, rerankScore: 0.65 },
];

// --- Sub-Components ---

const MacroBox: React.FC<{ icon: React.ReactNode, label: string, value: number, unit: string, colorClass: string, bgClass: string }> = ({ icon, label, value, unit, colorClass, bgClass }) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded-xl ${bgClass} border border-opacity-10 border-white`}>
        <div className={`flex items-center gap-1 mb-1 ${colorClass} opacity-80`}>
            {icon}
            <span className="text-[10px] font-bold uppercase">{label}</span>
        </div>
        <span className={`text-lg font-mono font-bold ${colorClass} tracking-tight`}>{value}<span className="text-[10px] ml-0.5 opacity-70">{unit}</span></span>
    </div>
);

const FileIcon: React.FC<{ type: DataSource['type'] }> = ({ type }) => {
    switch (type) {
        case 'PDF': return <FileText size={20} className="text-red-500" />;
        case 'JSON': return <FileJson size={20} className="text-yellow-500" />;
        case 'CSV': return <FileSpreadsheet size={20} className="text-green-500" />;
        default: return <FileType size={20} className="text-gray-500" />;
    }
};

// Refined Glass Panel Style
const GLASS_PANEL = "bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 flex flex-col overflow-hidden transition-all";
const DARK_GLASS_PANEL = "bg-gray-100/80 dark:bg-gray-950/80 backdrop-blur-2xl rounded-3xl shadow-inner border border-white/40 dark:border-white/5 flex flex-col overflow-hidden transition-all";

// --- Main Component ---

const KnowledgeBase: React.FC = () => {
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST' | 'EDITOR'>('GRID');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
    const [isDragging, setIsDragging] = useState(false);
    
    // Editor State
    const [simQuery, setSimQuery] = useState('');
    const [editorMode, setEditorMode] = useState<'STRUCTURED' | 'RAW'>('STRUCTURED');

    const handleFileSelect = (id: string) => {
        setSelectedFile(id);
        setViewMode('EDITOR');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop logic here
    };

    const filteredFiles = selectedFolderId === 'all' 
        ? DATA_SOURCES 
        : DATA_SOURCES.filter(f => f.folderId === selectedFolderId);

    const currentFolderName = selectedFolderId === 'all' 
        ? 'All Documents' 
        : FOLDERS.find(f => f.id === selectedFolderId)?.name || 'Unknown';

    // --- VIEW: EXPLORER (Split Panel) ---
    if (viewMode === 'GRID' || viewMode === 'LIST') {
        return (
            <div className="flex-1 h-full flex flex-col gap-6 overflow-hidden pb-4">
                {/* Main Split Container */}
                <div className="flex-1 flex gap-6 overflow-hidden">
                    
                    {/* LEFT PANEL: Folder Navigation */}
                    <div className={`w-1/4 min-w-[240px] ${DARK_GLASS_PANEL}`}>
                         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                 <Database size={18} className="text-brand-lime" />
                                 Library
                             </h3>
                             <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                                 <Plus size={16} />
                             </button>
                         </div>
                         
                         <div className="flex-1 overflow-y-auto p-3 space-y-1">
                             {/* All Documents Item */}
                             <button 
                                onClick={() => setSelectedFolderId('all')}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
                                    selectedFolderId === 'all' 
                                    ? 'bg-white dark:bg-gray-800 shadow-sm border border-brand-lime/30' 
                                    : 'hover:bg-white/50 dark:hover:bg-gray-800/50 border border-transparent'
                                }`}
                             >
                                 <div className="flex items-center gap-3">
                                     <div className={`p-1.5 rounded-lg ${selectedFolderId === 'all' ? 'bg-brand-lime text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                         <LayoutGrid size={16} />
                                     </div>
                                     <span className={`text-sm font-bold ${selectedFolderId === 'all' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>All Documents</span>
                                 </div>
                                 <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full">{DATA_SOURCES.length}</span>
                             </button>

                             <div className="my-2 h-px bg-gray-200 dark:bg-gray-800 mx-3"></div>
                             
                             <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Folders</p>
                             
                             {FOLDERS.map(folder => (
                                 <button 
                                    key={folder.id}
                                    onClick={() => setSelectedFolderId(folder.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                                        selectedFolderId === folder.id 
                                        ? 'bg-brand-lime-bg/50 dark:bg-brand-lime/10 border border-brand-lime/30' 
                                        : 'hover:bg-white/50 dark:hover:bg-gray-800/50 border border-transparent'
                                    }`}
                                 >
                                     <div className="flex items-center gap-3">
                                         {selectedFolderId === folder.id ? (
                                             <FolderOpen size={18} className="text-brand-lime fill-brand-lime/20" />
                                         ) : (
                                             <Folder size={18} className="text-brand-lime fill-brand-lime/20" />
                                         )}
                                         <span className={`text-sm font-medium ${selectedFolderId === folder.id ? 'text-brand-lime-dark dark:text-brand-lime' : 'text-gray-600 dark:text-gray-300'}`}>{folder.name}</span>
                                     </div>
                                     {selectedFolderId === folder.id && <ChevronRight size={14} className="text-brand-lime" />}
                                 </button>
                             ))}
                         </div>

                         {/* Quick Actions Footer */}
                         <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50">
                             <div className="flex gap-2">
                                 <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                                     <Plus size={14} /> New Folder
                                 </button>
                                 <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-lime text-xs font-bold text-white hover:bg-brand-lime-dark transition-colors shadow-sm">
                                     <CloudUpload size={14} /> Upload
                                 </button>
                             </div>
                         </div>
                    </div>

                    {/* RIGHT PANEL: Content Area */}
                    <div className={`flex-1 flex flex-col ${GLASS_PANEL}`}>
                        
                        {/* 1. Content Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-col gap-4">
                            {/* Top Bar: Breadcrumbs & Global Actions */}
                            <div className="flex justify-between items-center">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1 hover:text-brand-lime cursor-pointer transition-colors">
                                        <Home size={14} />
                                        <span className="font-bold">Knowledge Base</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300" />
                                    <div className="flex items-center gap-1 text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                        <FolderOpen size={14} className="text-brand-lime" />
                                        <span>{currentFolderName}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <Download size={14} /> Export CSV
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-transform">
                                        <RefreshCw size={14} />
                                        Sync All to Qdrant
                                    </button>
                                </div>
                            </div>

                            {/* Toolbar: Search & View Toggle */}
                            <div className="flex justify-between items-center">
                                <div className="relative">
                                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                     <input 
                                        type="text" 
                                        placeholder={`Search in ${currentFolderName}...`} 
                                        className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 w-80 transition-all"
                                     />
                                </div>
                                
                                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setViewMode('GRID')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-lime-dark dark:text-brand-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('LIST')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-lime-dark dark:text-brand-lime' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. File Display Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/20 dark:bg-[#0B0F17]/30">
                            
                            {/* Drag Drop Zone (Condensed) */}
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    mb-6 relative h-24 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-4 group cursor-pointer
                                    ${isDragging 
                                        ? 'border-brand-lime bg-brand-lime/10 scale-[1.01] shadow-[0_0_30px_-5px_rgba(132,204,22,0.3)]' 
                                        : 'border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/20 hover:border-brand-lime/50 hover:bg-white/60 dark:hover:bg-gray-800/40'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm ${isDragging ? 'text-brand-lime' : 'text-gray-400 group-hover:text-brand-lime'}`}>
                                    <CloudUpload size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {isDragging ? 'Drop to upload' : 'Click or drag files here'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">JSON, PDF, CSV (Max 25MB)</p>
                                </div>
                            </div>

                            {/* --- GRID VIEW --- */}
                            {viewMode === 'GRID' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                                    {filteredFiles.map((file) => (
                                        <div 
                                            key={file.id}
                                            onClick={() => handleFileSelect(file.id)}
                                            className="group relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/5 hover:border-brand-lime/50 dark:hover:border-brand-lime/50 transition-all duration-200 hover:shadow-lg hover:shadow-brand-lime/5 cursor-pointer flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                                    <FileIcon type={file.type} />
                                                </div>
                                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                    file.status === 'Synced' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                                    file.status === 'Error' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                    {file.status}
                                                </div>
                                            </div>
                                            
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1" title={file.name}>{file.name}</h4>
                                            <div className="text-[10px] font-mono text-gray-400 uppercase flex items-center gap-2 mb-3">
                                                <span>{file.size}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{file.chunks} Chunks</span>
                                            </div>

                                            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400">{file.uploadDate}</span>
                                                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-brand-lime transition-colors">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- LIST VIEW --- */}
                            {viewMode === 'LIST' && (
                                <div className="bg-white/60 dark:bg-gray-900/40 rounded-2xl border border-white/50 dark:border-white/5 overflow-hidden backdrop-blur-md">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-white/5">
                                            <tr>
                                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">File Name</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chunks</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Synced</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredFiles.map((file) => (
                                                <tr 
                                                    key={file.id} 
                                                    onClick={() => handleFileSelect(file.id)}
                                                    className="hover:bg-white dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <FileIcon type={file.type} />
                                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{file.size}</td>
                                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{file.chunks}</td>
                                                    <td className="px-6 py-4 text-xs text-gray-500">{file.uploadDate}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {file.status === 'Synced' && <CheckCircle2 size={14} className="text-brand-lime" />}
                                                            {file.status === 'Error' && <AlertCircle size={14} className="text-red-500" />}
                                                            {file.status === 'Indexing' && <Loader2 size={14} className="text-yellow-500 animate-spin" />}
                                                            <span className={`text-xs font-medium ${
                                                                file.status === 'Synced' ? 'text-gray-700 dark:text-gray-300' :
                                                                file.status === 'Error' ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>{file.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-brand-lime transition-colors opacity-0 group-hover:opacity-100">
                                                            <Eye size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // --- VIEW: EDITOR & SIMULATOR (Detail View) ---
    const currentFile = DATA_SOURCES.find(f => f.id === selectedFile);

    return (
        <div className="flex-1 h-full flex flex-col gap-6 overflow-hidden pb-2 text-gray-200 animate-in slide-in-from-right-4 fade-in duration-300">
             {/* Editor Toolbar */}
             <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setViewMode('GRID')}
                        className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors border border-white/20 dark:border-white/10"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {currentFile?.name || 'Editor'}
                            <span className="text-xs font-mono font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">READ ONLY</span>
                        </h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-brand-lime text-white text-xs font-bold shadow-lg shadow-brand-lime/20 hover:bg-brand-lime-dark transition-colors">
                        Save Changes
                    </button>
                </div>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* --- COLUMN 1: CHUNK EDITOR (60%) --- */}
                <div className={`${GLASS_PANEL} flex-1`}>
                    <div className="h-14 border-b border-white/40 dark:border-white/10 flex items-center justify-between px-6 bg-gray-50/30 dark:bg-gray-900/30">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Chunk Editor</h3>
                        </div>
                        <div className="flex bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-1 gap-1">
                            <button 
                                onClick={() => setEditorMode('STRUCTURED')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${editorMode === 'STRUCTURED' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Structured
                            </button>
                            <button 
                                onClick={() => setEditorMode('RAW')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${editorMode === 'RAW' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Raw JSON
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20 dark:bg-[#0B0F17]/50">
                        {editorMode === 'STRUCTURED' ? (
                            FOOD_ITEMS.map((item) => (
                                <div key={item.id} className="bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-white/50 dark:border-gray-700/50 p-5 shadow-sm hover:border-brand-lime/50 transition-all group relative backdrop-blur-md">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                {item.name}
                                                {item.sanityCheck && (
                                                    <div className="flex items-center gap-1 bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-[10px] px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-700">
                                                        <AlertTriangle size={10} />
                                                        {item.sanityCheck}
                                                    </div>
                                                )}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 hover:border-brand-lime hover:text-brand-lime dark:hover:text-brand-lime cursor-pointer transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                                <button className="text-[10px] text-gray-400 hover:text-brand-lime flex items-center gap-1 px-2 py-1 border border-dashed border-gray-300 dark:border-gray-600 rounded-full">
                                                    <Tag size={10} /> Add Tag
                                                </button>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-400 hover:text-brand-lime hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-sm border border-gray-100 dark:border-gray-600">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>

                                    {/* Macro Grid */}
                                    <div className="grid grid-cols-4 gap-3">
                                        <MacroBox 
                                            icon={<Flame size={12} />} 
                                            label="Calories" 
                                            value={item.calories} 
                                            unit="kcal"
                                            colorClass="text-orange-500 dark:text-orange-400"
                                            bgClass="bg-orange-50/80 dark:bg-orange-900/10"
                                        />
                                        <MacroBox 
                                            icon={<Beef size={12} />} 
                                            label="Protein" 
                                            value={item.protein} 
                                            unit="g"
                                            colorClass="text-red-500 dark:text-red-400"
                                            bgClass="bg-red-50/80 dark:bg-red-900/10"
                                        />
                                        <MacroBox 
                                            icon={<Wheat size={12} />} 
                                            label="Carbs" 
                                            value={item.carbs} 
                                            unit="g"
                                            colorClass="text-blue-500 dark:text-blue-400"
                                            bgClass="bg-blue-50/80 dark:bg-blue-900/10"
                                        />
                                        <MacroBox 
                                            icon={<Droplets size={12} />} 
                                            label="Fat" 
                                            value={item.fat} 
                                            unit="g"
                                            colorClass="text-yellow-500 dark:text-yellow-400"
                                            bgClass="bg-yellow-50/80 dark:bg-yellow-900/10"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#0D1117] p-4 rounded-xl border border-gray-700 font-mono text-xs text-gray-300 leading-6 overflow-x-auto">
                                {JSON.stringify(FOOD_ITEMS, null, 4)}
                            </div>
                        )}
                    </div>
                </div>


                {/* --- COLUMN 2: SIMULATOR (40%) --- */}
                <div className="w-full lg:w-[40%] flex flex-col gap-6">
                    
                    {/* Search / Simulator Box */}
                    <div className={`${GLASS_PANEL} h-full`}>
                        <div className="p-5 border-b border-white/40 dark:border-white/10 bg-gray-50/30 dark:bg-gray-900/30">
                             <div className="flex items-center gap-2 mb-3">
                                 <BarChart3 size={18} className="text-brand-lime" />
                                 <h3 className="font-bold text-gray-900 dark:text-white text-sm">Retrieval Simulator</h3>
                             </div>
                             <div className="relative">
                                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input 
                                    type="text" 
                                    value={simQuery}
                                    onChange={(e) => setSimQuery(e.target.value)}
                                    placeholder="Query (e.g., 'Món nhiều protein')" 
                                    className="w-full bg-white/80 dark:bg-gray-900/80 border border-white/50 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all"
                                 />
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/20 dark:bg-[#0B0F17]/50">
                            {simQuery ? (
                                SIMULATION_RESULTS.map((result) => (
                                    <div key={result.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 dark:border-gray-700 hover:border-brand-lime/30 transition-colors shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-brand-lime-dark dark:text-brand-lime">{result.foodName}</h4>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Score</span>
                                                <span className="text-xs font-mono font-bold text-white bg-brand-lime px-1.5 rounded">{Math.round(result.similarity * 100)}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3 bg-gray-50/50 dark:bg-gray-900/50 p-2 rounded-lg italic border border-gray-100 dark:border-gray-800">
                                            "{result.chunkText}"
                                        </p>
                                        
                                        {/* Rerank Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                                <span>Rerank Confidence</span>
                                                <span className="text-gray-300">{result.rerankScore.toFixed(2)}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${result.rerankScore * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600">
                                    <Search size={32} className="mb-2 opacity-20" />
                                    <p className="text-xs font-medium">Enter a query to simulate retrieval</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default KnowledgeBase;
