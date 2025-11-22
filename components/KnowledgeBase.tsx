
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
    ArrowLeft
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

interface DataSource {
    id: string;
    name: string;
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

const DATA_SOURCES: DataSource[] = [
    { id: 'f1', name: 'menu_pho_bo.json', type: 'JSON', status: 'Synced', size: '1.2 MB', chunks: 45, progress: 100, uploadDate: '10 mins ago' },
    { id: 'f2', name: 'gym_supplements_v2.pdf', type: 'PDF', status: 'Synced', size: '4.5 MB', chunks: 128, progress: 100, uploadDate: '2 hours ago' },
    { id: 'f3', name: 'raw_chicken_suppliers.csv', type: 'CSV', status: 'Error', size: '12.8 MB', chunks: 0, progress: 15, uploadDate: 'Yesterday' },
    { id: 'f4', name: 'vegan_alternatives_list.txt', type: 'TXT', status: 'Indexing', size: '0.5 MB', chunks: 12, progress: 65, uploadDate: 'Just now' },
    { id: 'f5', name: 'hanoi_street_food.json', type: 'JSON', status: 'Synced', size: '2.1 MB', chunks: 89, progress: 100, uploadDate: '2 days ago' },
    { id: 'f6', name: 'macro_cheat_sheet.pdf', type: 'PDF', status: 'Synced', size: '3.2 MB', chunks: 94, progress: 100, uploadDate: '3 days ago' },
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

// --- Main Component ---

const KnowledgeBase: React.FC = () => {
    const [viewMode, setViewMode] = useState<'GRID' | 'EDITOR'>('GRID');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
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

    // --- VIEW: GRID (File Management) ---
    if (viewMode === 'GRID') {
        return (
            <div className="flex-1 h-full flex flex-col overflow-hidden pb-4 space-y-6">
                
                {/* Header Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Database className="text-brand-lime" />
                            Knowledge Base
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Manage ingestion pipelines and vector indices.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search files..." 
                                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-white/40 dark:border-white/10 text-sm focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 w-64 transition-all"
                             />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                            <RefreshCw size={16} />
                            Sync All to Qdrant
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8">
                    
                    {/* Upload Drop Zone */}
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative h-48 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer
                            ${isDragging 
                                ? 'border-brand-lime bg-brand-lime/10 scale-[1.01] shadow-[0_0_30px_-5px_rgba(132,204,22,0.3)]' 
                                : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-brand-lime/50 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }
                        `}
                    >
                        <div className={`p-4 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-transform duration-300 ${isDragging ? 'scale-110 text-brand-lime' : 'text-gray-400 group-hover:text-brand-lime'}`}>
                            <CloudUpload size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {isDragging ? 'Drop files to upload' : 'Click or drag files here'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Support JSON, PDF, CSV (Max 25MB)</p>
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Sources ({DATA_SOURCES.length})</h3>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button className="p-1.5 rounded bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"><LayoutGrid size={16} /></button>
                                <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><List size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {DATA_SOURCES.map((file) => (
                                <div 
                                    key={file.id}
                                    className="group relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/5 hover:border-brand-lime/50 dark:hover:border-brand-lime/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-lime/5 flex flex-col"
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                                                <FileIcon type={file.type} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[120px]" title={file.name}>{file.name}</h4>
                                                <span className="text-[10px] font-mono text-gray-400 uppercase">{file.type} • {file.size}</span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-brand-lime transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>

                                    {/* Card Body: Stats */}
                                    <div className="flex-1 grid grid-cols-2 gap-2 mb-4">
                                        <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-2 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700/50">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{file.chunks}</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Chunks</span>
                                        </div>
                                        <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-2 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700/50">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{file.uploadDate.split(' ')[0]}</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">{file.uploadDate.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                    </div>

                                    {/* Status Bar */}
                                    <div className="mb-5">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className={`text-[10px] font-bold uppercase flex items-center gap-1.5 ${
                                                file.status === 'Error' ? 'text-red-500' :
                                                file.status === 'Indexing' ? 'text-yellow-500' : 'text-brand-lime-dark dark:text-brand-lime'
                                            }`}>
                                                {file.status === 'Indexing' && <Loader2 size={10} className="animate-spin" />}
                                                {file.status === 'Error' && <AlertCircle size={10} />}
                                                {file.status === 'Synced' && <CheckCircle2 size={10} />}
                                                {file.status}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-400">{file.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    file.status === 'Error' ? 'bg-red-500' : 
                                                    file.status === 'Indexing' ? 'bg-yellow-500 animate-pulse' : 'bg-brand-lime'
                                                }`} 
                                                style={{ width: `${file.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Card Footer: Actions */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                        <button 
                                            onClick={() => handleFileSelect(file.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-brand-lime hover:text-white dark:hover:text-white transition-all group/btn"
                                        >
                                            <Eye size={14} />
                                            View
                                        </button>
                                        <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand-lime hover:bg-white dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600" title="Re-index">
                                            <RefreshCw size={14} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30" title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
