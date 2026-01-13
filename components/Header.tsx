import React from 'react';
import { useAuthStore } from '../store';
import { vi } from '../lang/vi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#314668] bg-background-dark/95 backdrop-blur shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4 text-white">
        <button className="p-1 rounded-lg hover:bg-[#314668] lg:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#90a7cb]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input 
            className="bg-card-dark border-none text-white text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary w-64 placeholder-[#90a7cb]" 
            placeholder={vi.common.search}
            type="text" 
          />
        </div>
        <button className="flex items-center justify-center rounded-xl size-10 bg-card-dark text-white hover:bg-[#314668] transition-colors relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-card-dark"></span>
        </button>
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-primary hover:bg-blue-600 transition-colors ml-2 cursor-pointer select-none"
        >
          <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
             {user?.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
             ) : (
                <span className="material-symbols-outlined text-white text-[20px]">person</span>
             )}
          </div>
          <span className="text-white text-sm font-bold truncate max-w-[100px] hidden sm:block">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;