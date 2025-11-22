
import React from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Settings2, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';

// --- Types ---

export interface FilterOption {
  label: string;
  value: string;
}

export interface FacetedFilterProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export interface DataTableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  totalItems: number;
}

// --- Components ---

export const FacetedFilter: React.FC<FacetedFilterProps> = ({ 
  title, 
  options, 
  selectedValues, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs font-bold transition-all ${
            selectedValues.length > 0 
            ? 'bg-brand-lime-bg border-brand-lime text-brand-lime-dark' 
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
        }`}
      >
        <Filter size={14} />
        <span>{title}</span>
        {selectedValues.length > 0 && (
            <span className="bg-brand-lime text-white px-1.5 py-0.5 rounded text-[10px]">
                {selectedValues.length}
            </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-1">
               {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                      <div 
                        key={option.value}
                        onClick={() => toggleValue(option.value)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                      >
                         <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                             isSelected 
                             ? 'bg-brand-lime border-brand-lime text-white' 
                             : 'border-gray-300 dark:border-gray-600 bg-transparent'
                         }`}>
                             {isSelected && <Check size={10} strokeWidth={4} />}
                         </div>
                         <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{option.label}</span>
                      </div>
                  )
               })}
            </div>
            {selectedValues.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-2 text-center">
                    <button 
                        onClick={() => onChange([])}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    >
                        Clear filters
                    </button>
                </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Filter tasks...",
  filters,
  actions
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 border-b border-white/40 dark:border-white/10">
       <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
          {/* Local Search */}
          <div className="relative w-full md:max-w-xs">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-white/40 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/50 transition-all"
             />
          </div>
          
          {/* Filters Slot */}
          {filters}
       </div>

       <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {actions}
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-white/40 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Settings2 size={14} />
              <span>View</span>
          </button>
       </div>
    </div>
  );
};

export const DataTablePagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    return (
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/40 dark:border-white/10 bg-gray-50/30 dark:bg-gray-900/30">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rows per page</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold px-2 py-1 outline-none"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Page {currentPage} of {totalPages} ({totalItems} items)
                </span>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <button 
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};
