import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import { UserRole } from '../../types';
import { Shield, ChevronUp, ChevronDown, User, LogOut, Loader2 } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

const DevAuthMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();
  const addToast = useUIStore(state => state.addToast);

  const handleLogin = async (username: string) => {
    setIsLoading(true);
    try {
        const user = await mockApi.login(username); // Using mockApi for consistent DB lookup
        login(user);
        
        if (user.role === UserRole.ADMIN) navigate('/dashboard');
        else if (user.role === UserRole.CASHIER) navigate('/pos');
        else if (user.role === UserRole.KITCHEN) navigate('/kds');
        else navigate('/dashboard');
        
        setIsOpen(false);
        addToast('success', `Dev Login: ${user.name}`);
    } catch (e) {
        addToast('danger', 'Dev Login Failed');
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-[#1f2937] border border-slate-700 rounded-xl shadow-2xl p-2 w-48 mb-2 flex flex-col gap-1 animate-in slide-in-from-bottom-5">
           <div className="px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700 mb-1">
             Quick Auth (Dev)
           </div>
           
           <button 
             onClick={() => handleLogin('admin')}
             disabled={isLoading}
             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-sm text-slate-300 hover:text-white text-left transition-colors disabled:opacity-50"
           >
             <Shield size={14} className="text-purple-400" /> Admin
           </button>
           
           <button 
             onClick={() => handleLogin('cashier')}
             disabled={isLoading}
             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-sm text-slate-300 hover:text-white text-left transition-colors disabled:opacity-50"
           >
             <User size={14} className="text-blue-400" /> Cashier
           </button>
           
           <button 
             onClick={() => handleLogin('kitchen')}
             disabled={isLoading}
             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-sm text-slate-300 hover:text-white text-left transition-colors disabled:opacity-50"
           >
             <User size={14} className="text-orange-400" /> Kitchen
           </button>

           <div className="h-px bg-slate-700 my-1" />

           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/20 text-sm text-red-400 hover:text-red-300 text-left transition-colors"
           >
             <LogOut size={14} /> Logout
           </button>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center justify-center size-12 rounded-full shadow-lg transition-all ${
           isOpen ? 'bg-blue-600 text-white rotate-0' : 'bg-[#1f2937] text-slate-400 hover:text-white border border-slate-700'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isOpen ? <ChevronDown size={24} /> : <Shield size={20} />)}
      </button>
    </div>
  );
};

export default DevAuthMenu;