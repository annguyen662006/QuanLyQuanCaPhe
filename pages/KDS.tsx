import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store';
import { vi } from '../lang/vi';
import { useNavigate } from 'react-router-dom';

const KDS: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  // Dropdown State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
      <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#223149] px-6 py-3 bg-white dark:bg-[#101723] z-10 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">KDS System</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><span className="block size-2 rounded-full bg-green-500"></span> Online</span>
              <span>•</span>
              <span>12:45 PM</span>
            </div>
          </div>
        </div>
        
        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 focus:outline-none hover:bg-slate-100 dark:hover:bg-[#1f2937] p-1.5 rounded-full pr-3 transition-colors border border-transparent focus:border-slate-200 dark:focus:border-slate-700"
          >
             <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-slate-200 dark:border-[#223149]" style={{ backgroundImage: `url('${user?.avatar || 'https://picsum.photos/100'}')` }}></div>
             <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'Kitchen'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.role || 'Bếp'}</p>
             </div>
             <span className={`material-symbols-outlined text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f2937] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 md:hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
                </div>
                
                <div className="p-1">
                  <button 
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-3 transition-colors"
                  >
                      <span className="material-symbols-outlined text-[20px] text-slate-400">person</span>
                      Hồ sơ cá nhân
                  </button>
                  <button 
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-3 transition-colors"
                  >
                      <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
                      Cài đặt
                  </button>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>

                <div className="p-1">
                  <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-3 transition-colors"
                  >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Đăng xuất
                  </button>
                </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden bg-background-light dark:bg-background-dark p-6">
        <div className="flex h-full gap-6 min-w-max">
          {/* Column 1: New */}
          <div className="flex flex-col w-[380px] h-full rounded-xl bg-slate-100 dark:bg-[#161e2c] border border-slate-200 dark:border-[#223149]">
             <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#223149]">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-blue-500">fiber_new</span>
                   <h3 className="text-lg font-bold">{vi.kds.new}</h3>
                   <span className="flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {[
                   { id: '#105', table: 'Table 05', timer: '01:20', items: [{q: 1, name: 'Gà Rán Giòn'}, {q: 2, name: 'Khoai Tây Chiên', note: 'Ít muối'}] },
                   { id: '#104', table: 'Table 02', timer: '03:45', items: [{q: 1, name: 'Salad Caesar'}] },
                   { id: '#106', table: 'Table 08', timer: '00:15', items: [{q: 4, name: 'Bia Tiger'}] },
                ].map((card, i) => (
                   <article key={i} className="flex flex-col gap-0 rounded-lg bg-white dark:bg-card-dark shadow-sm border-l-[6px] border-success relative overflow-hidden group">
                      <div className="p-4 pb-2 flex justify-between items-start">
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{card.id}</h4>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.table}</p>
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-success font-mono font-bold text-sm">
                            <span className="material-symbols-outlined text-[16px]">timer</span> {card.timer}
                         </div>
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-3">
                         <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-700/50"></div>
                         {card.items.map((item, j) => (
                            <div key={j} className="flex gap-3 items-start">
                               <div className="flex-none flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold">{item.q}</div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                                  {item.note && <span className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">Note: {item.note}</span>}
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="p-4 pt-2 mt-auto">
                         <button className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm transition-all">
                            <span>Nhận món</span>
                         </button>
                      </div>
                   </article>
                ))}
             </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="flex flex-col w-[380px] h-full rounded-xl bg-slate-100 dark:bg-[#161e2c] border border-slate-200 dark:border-[#223149]">
             <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#223149]">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-warning">skillet</span>
                   <h3 className="text-lg font-bold">{vi.kds.prep}</h3>
                   <span className="flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 text-xs font-bold">4</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                 {[
                   { id: '#99', table: 'Table 12', timer: '25:12', border: 'border-error', timerColor: 'text-error bg-red-50 dark:bg-red-900/20', animate: true, items: [{q: 1, name: 'Bò Bít Tết', note: 'Allergy - Nuts'}, {q: 1, name: 'Súp Nấm'}] },
                   { id: '#102', table: 'Table 05', timer: '12:30', border: 'border-warning', timerColor: 'text-warning bg-yellow-50 dark:bg-yellow-900/20', items: [{q: 1, name: 'Phở Bò'}, {q: 2, name: 'Trà Đá'}] },
                   { id: '#103', table: 'Table 12', timer: '08:00', border: 'border-success', timerColor: 'text-success bg-green-50 dark:bg-green-900/20', items: [{q: 1, name: 'Pizza Hải Sản'}] }
                 ].map((card, i) => (
                    <article key={i} className={`flex flex-col gap-0 rounded-lg bg-white dark:bg-card-dark shadow-sm border-l-[6px] ${card.border} relative overflow-hidden group`}>
                       <div className="p-4 pb-2 flex justify-between items-start">
                          <div>
                             <h4 className="text-xl font-bold text-slate-900 dark:text-white">{card.id}</h4>
                             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.table}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded font-mono font-bold text-sm ${card.timerColor} ${card.animate ? 'animate-pulse' : ''}`}>
                             <span className="material-symbols-outlined text-[16px]">timer</span> {card.timer}
                          </div>
                       </div>
                       <div className="px-4 py-2 flex flex-col gap-3">
                         <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-700/50"></div>
                         {card.items.map((item, j) => (
                            <div key={j} className="flex gap-3 items-start">
                               <div className="flex-none flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold">{item.q}</div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                                  {item.note && <span className="text-xs text-red-500 italic mt-0.5">Note: {item.note}</span>}
                               </div>
                            </div>
                         ))}
                       </div>
                       <div className="p-4 pt-2 mt-auto">
                         <button className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm transition-all">
                            <span className="material-symbols-outlined text-[20px]">check</span>
                            <span>{vi.kds.complete}</span>
                         </button>
                       </div>
                    </article>
                 ))}
             </div>
          </div>

          {/* Column 3: Ready */}
          <div className="flex flex-col w-[380px] h-full rounded-xl bg-slate-100 dark:bg-[#161e2c] border border-slate-200 dark:border-[#223149] opacity-75">
             <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#223149]">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-green-500">room_service</span>
                   <h3 className="text-lg font-bold">{vi.kds.ready}</h3>
                   <span className="flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 text-xs font-bold">2</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {[
                   { id: '#100', table: 'Table 01', items: [{q: 2, name: 'Cà Phê Sữa Đá'}] },
                   { id: '#101', table: 'Table 03', items: [{q: 1, name: 'Sinh tố bơ'}] },
                ].map((card, i) => (
                   <article key={i} className="flex flex-col gap-0 rounded-lg bg-white dark:bg-card-dark shadow-sm border-l-[6px] border-slate-400 dark:border-slate-600 relative overflow-hidden group">
                      <div className="p-4 pb-2 flex justify-between items-start">
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white decoration-2 line-through decoration-slate-500">{card.id}</h4>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.table}</p>
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono font-bold text-sm">
                            <span className="material-symbols-outlined text-[16px]">done_all</span> Done
                         </div>
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-3">
                         <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-700/50"></div>
                         {card.items.map((item, j) => (
                            <div key={j} className="flex gap-3 items-start opacity-60">
                               <div className="flex-none flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold">{item.q}</div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="p-4 pt-2 mt-auto">
                         <button className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-slate-200 dark:bg-[#2e3f5a] text-slate-600 dark:text-slate-300 font-bold text-sm transition-all hover:bg-slate-300 dark:hover:bg-[#3b4f6e]">
                            <span>{vi.kds.serve}</span>
                         </button>
                      </div>
                   </article>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KDS;