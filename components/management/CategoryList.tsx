
import React from 'react';
import { Category } from '../../types';
import { GripVerticalIcon, PlusIcon, PencilIcon, TrashIcon } from '../Icons';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '../../lib/utils';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories,
  isLoading,
  selectedCategoryId, 
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 h-full">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md bg-gray-700/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar">
        <Droppable droppableId="category-list">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="space-y-2"
            >
              {categories.map((category, index) => {
                const isSelected = selectedCategoryId === category.id;
                
                return (
                  <Draggable key={category.id} draggableId={category.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 select-none relative overflow-hidden",
                          isSelected 
                            ? "bg-gray-700 border-l-4 border-blue-500 text-white" 
                            : "bg-transparent text-gray-300 border-l-4 border-transparent hover:bg-gray-700/50",
                          snapshot.isDragging 
                            ? "bg-gray-800 shadow-xl border border-slate-600 opacity-90 scale-[1.02] z-50" 
                            : ""
                        )}
                        style={provided.draggableProps.style}
                        onClick={() => onSelectCategory(category.id)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          <div 
                            {...provided.dragHandleProps}
                            className={cn(
                              "flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-600 transition-colors",
                              isSelected ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"
                            )}
                          >
                             <GripVerticalIcon size={16} />
                          </div>
                          
                          <span className="font-medium truncate">{category.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           {/* Hover Actions */}
                           <div className="hidden group-hover:flex items-center gap-1 bg-gray-800/80 backdrop-blur-sm rounded-lg p-0.5 absolute right-10 top-1/2 -translate-y-1/2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onEditCategory(category); }}
                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                              >
                                <PencilIcon size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteCategory(category); }}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <TrashIcon size={14} />
                              </button>
                           </div>

                           <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full min-w-[24px] text-center transition-opacity",
                            isSelected ? "bg-blue-600/20 text-blue-200" : "bg-gray-700 text-gray-500",
                            "group-hover:opacity-0" // Hide counter on hover to show actions
                           )}>
                            {category.count}
                           </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      <button
        onClick={onAddCategory}
        className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 border border-transparent hover:border-gray-600"
      >
        <PlusIcon size={18} />
        <span className="font-medium text-sm">+ Thêm Danh Mục</span>
      </button>
    </div>
  );
};

export default CategoryList;
