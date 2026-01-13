import React from 'react';
import { useUIStore, Toast } from '../../store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    danger: <AlertCircle size={20} className="text-red-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  const borders = {
    success: "border-green-500/20 bg-green-500/10",
    danger: "border-red-500/20 bg-red-500/10",
    warning: "border-yellow-500/20 bg-yellow-500/10",
    info: "border-blue-500/20 bg-blue-500/10",
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-in slide-in-from-right-full w-80 ${borders[toast.type]}`}>
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{toast.message}</p>
      </div>
      <button 
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;