
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
    ArrowRight
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
    status: 'Synced' | 'Parsing' | 'Error';
    itemsCount: number;
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
    { id: 'f1', name: 'menu_pho_bo.json', status: 'Synced', itemsCount: 12, uploadDate: '10 mins ago' },
    { id: 'f2', name: 'gym_supplements_v2.pdf', status: 'Synced', itemsCount: 45, uploadDate: '2 hours ago' },
    { id: 'f3', name: 'raw_chicken_suppliers.csv', status: 'Error', itemsCount: 0, uploadDate: 'Yesterday' },
    { id: 'f4', name: 'vegan_alternatives_list.txt', status: 'Parsing', itemsCount: 0, uploadDate: 'Just now' },
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

const StatusBadge: React.FC<{ status: DataSource['status'] }> = ({ status }) => {
    if (status === 'Synced') return <CheckCircle2 size={14} className="text-brand-lime" />;
    if (status === 'Parsing') return <Loader2 size={14} className="text-yellow-500 animate-spin" />;
    return <AlertCircle size={14} className="text-red-500" />;
};

// Refined Glass Panel Style
const GLASS_PANEL = "bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/40 dark:border-white/10 flex flex-col overflow-hidden transition-all";

// --- Main Component ---

const KnowledgeBase: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string>(DATA_SOURCES[0].id);
    const [viewMode, setViewMode] = useState<'STRUCTURED' | 'RAW'>('STRUCTURED');
    const [simQuery, setSimQuery] = useState('');

    return (
        <div className="flex-1 h-full flex flex-col lg:flex-row gap-6 overflow-hidden pb-2 text-gray-200">
            
            {/* --- COLUMN 1: DATA SOURCES (20%) --- */}
            <div className={`${GLASS_PANEL} w-full lg:w-[22%]`}>
                <div className="p-5 border-b border-white/40 dark:border-white/10">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Data Sources</h3>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-brand-lime/50 bg-brand-lime-bg/50 dark:bg-brand-lime/5 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-lime-light dark:hover:bg-brand-lime/10 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                            <CloudUpload size={20} className="text-brand-lime-dark dark:text-brand-lime" />
                        </div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Click to Upload</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">JSON, PDF, CSV Menus</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {DATA_SOURCES.map((file) => (
                        <div 
                            key={file.id}
                            onClick={() => setSelectedFile(file.id)}
                            className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                                selectedFile === file.id 
                                ? 'bg-white/50 dark:bg-gray-800/50 border-brand-lime shadow-sm' 
                                : 'bg-transparent border-transparent hover:bg-white/30 dark:hover:bg-gray-700/30'
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`p-2 rounded-lg ${selectedFile === file.id ? 'bg-white dark:bg-gray-800 text-brand-lime' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    <FileText size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-xs font-bold truncate ${selectedFile === file.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{file.name}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{file.uploadDate} • {file.itemsCount} items</p>
                                </div>
                            </div>
                            <StatusBadge status={file.status} />
                        </div>
                    ))}
                </div>
            </div>


            {/* --- COLUMN 2: CHUNK EDITOR (48%) --- */}
            <div className={`${GLASS_PANEL} flex-1`}>
                
                {/* Editor Header */}
                <div className="h-16 border-b border-white/40 dark:border-white/10 flex items-center justify-between px-6 bg-gray-50/30 dark:bg-gray-900/30">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gym Food Editor</h3>
                        <div className="flex bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-1 gap-1">
                            <button 
                                onClick={() => setViewMode('STRUCTURED')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'STRUCTURED' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Structured Data
                            </button>
                            <button 
                                onClick={() => setViewMode('RAW')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'RAW' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Raw JSON
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                            <Trash2 size={18} />
                         </button>
                         <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-brand-lime transition-colors">
                            <MoreHorizontal size={18} />
                         </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20 dark:bg-[#0B0F17]/50">
                    {viewMode === 'STRUCTURED' ? (
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


            {/* --- COLUMN 3: SIMULATOR (30%) --- */}
            <div className="w-full lg:w-[30%] flex flex-col gap-6">
                
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
    );
};

export default KnowledgeBase;
