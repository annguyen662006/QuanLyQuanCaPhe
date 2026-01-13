import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { vi } from '../lang/vi';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: vi.common.dashboard },
    { path: '/pos', icon: 'shopping_bag', label: vi.common.pos },
    { path: '/inventory', icon: 'inventory_2', label: vi.common.inventory },
    { path: '/employees', icon: 'group', label: vi.common.employees },
    { path: '/products', icon: 'shopping_cart', label: 'Sản phẩm' },
    { path: '/settings', icon: 'settings', label: vi.common.settings },
  ];

  return (
    <aside className="w-64 bg-card-dark flex flex-col h-full border-r border-[#314668] shrink-0 z-20 transition-all duration-300">
      <div className="p-6 flex flex-col gap-6 h-full">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg w-10 h-10 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
             <span className="material-symbols-outlined text-white">point_of_sale</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-tight">Modern POS</h1>
            <p className="text-[#90a7cb] text-xs font-normal">Quản lý cửa hàng</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive(item.path)
                  ? 'bg-primary text-white shadow-md'
                  : 'text-[#90a7cb] hover:bg-[#314668] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${!isActive(item.path) && 'group-hover:text-white'} transition-colors`}>
                {item.icon}
              </span>
              <p className="text-sm font-medium">{item.label}</p>
            </Link>
          ))}
        </nav>

        {/* Bottom Action */}
        <div className="mt-auto pt-4 border-t border-[#314668]">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[#90a7cb] hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">{vi.common.logout}</p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
