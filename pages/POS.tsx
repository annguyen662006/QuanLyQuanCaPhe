import React from 'react';
import { useAuthStore, usePOSStore } from '../store';
import { vi } from '../lang/vi';
import { useNavigate } from 'react-router-dom';

const POS: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, orderType, setOrderType } = usePOSStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleLogout = () => {
      useAuthStore.getState().logout();
      navigate('/');
  };

  const products = [
      { id: '1', name: 'Cà phê Sữa đá', price: 29000, img: 'https://picsum.photos/200?random=1', category: 'Cà phê' },
      { id: '2', name: 'Trà Đào Cam Sả', price: 45000, img: 'https://picsum.photos/200?random=2', category: 'Trà' },
      { id: '3', name: 'Bạc Xỉu', price: 32000, img: 'https://picsum.photos/200?random=3', category: 'Cà phê' },
      { id: '4', name: 'Cà phê Đen', price: 25000, img: 'https://picsum.photos/200?random=4', category: 'Cà phê' },
      { id: '5', name: 'Trà Vải', price: 42000, img: 'https://picsum.photos/200?random=5', category: 'Trà' },
      { id: '6', name: 'Sinh tố Bơ', price: 50000, img: 'https://picsum.photos/200?random=6', category: 'Sinh tố' },
      { id: '7', name: 'Cookie Sô-cô-la', price: 20000, img: 'https://picsum.photos/200?random=7', category: 'Bánh' },
      { id: '8', name: 'Bánh Croissant', price: 35000, img: 'https://picsum.photos/200?random=8', category: 'Bánh' },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col w-full">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-[#151e2d] shrink-0 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-white">
              <span className="material-symbols-outlined text-2xl">point_of_sale</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">POS System</h2>
          </div>
          <label className="hidden md:flex flex-col min-w-40 h-10 w-96">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-primary transition-colors">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-slate-400 px-3 pl-2 text-sm font-normal" placeholder="Tìm món ăn, đồ uống..." />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              <span className="material-symbols-outlined text-[20px]">wifi</span>
              <span className="text-xs font-semibold">Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[20px]">cloud_done</span>
              <span className="text-xs font-semibold">Synced</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout} title="Đăng xuất">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Cashier'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Thu ngân</p>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700" style={{ backgroundImage: user?.avatar ? `url('${user.avatar}')` : 'none', backgroundColor: '#333' }}>
               {!user?.avatar && <span className="flex items-center justify-center h-full text-white">?</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Categories */}
        <aside className="w-24 md:w-64 flex-none bg-white dark:bg-[#101722] border-r border-slate-200 dark:border-slate-800 flex flex-col">
           <div className="p-4 flex flex-col gap-2 overflow-y-auto">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 px-3 hidden md:block">{vi.pos.categories}</h3>
              <button className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group transition-all w-full">
                 <span className="material-symbols-outlined">local_cafe</span>
                 <span className="text-sm font-semibold hidden md:block">Cà phê</span>
              </button>
              {['Trà sữa', 'Sinh tố', 'Bánh ngọt', 'Snacks', 'Kem'].map((cat, i) => (
                 <button key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all w-full group">
                    <span className="material-symbols-outlined group-hover:text-primary transition-colors">fastfood</span>
                    <span className="text-sm font-medium hidden md:block group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat}</span>
                 </button>
              ))}
           </div>
        </aside>

        {/* Middle Column: Products */}
        <main className="flex-1 bg-slate-50 dark:bg-[#0b1019] relative overflow-y-auto p-4 md:p-6">
           <div className="max-w-[1200px] mx-auto">
              <div className="flex items-center justify-between mb-6">
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cà phê</h1>
                 <div className="text-sm text-slate-500">Hiển thị {products.length} sản phẩm</div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {products.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => addToCart(product)}
                      className="flex flex-col gap-3 p-3 rounded-2xl bg-white dark:bg-[#151e2d] border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all cursor-pointer group shadow-sm hover:shadow-md"
                    >
                       <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl overflow-hidden relative" style={{ backgroundImage: `url('${product.img}')` }}>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                       </div>
                       <div>
                          <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{product.price.toLocaleString()}đ</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </main>

        {/* Right Column: Order */}
        <aside className="w-full md:w-[380px] lg:w-[420px] flex-none bg-white dark:bg-[#151e2d] border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-xl shadow-black/20">
           <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">{vi.pos.currentOrder}</h3>
                 <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-300">
                    25/10/2023, 10:30
                 </div>
              </div>
              <div className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                 <label onClick={() => setOrderType('dine-in')} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${orderType === 'dine-in' ? 'bg-white dark:bg-[#101722] shadow-sm text-primary' : 'text-slate-500'}`}>
                    <span className="truncate text-sm font-bold">{vi.pos.dineIn}</span>
                 </label>
                 <label onClick={() => setOrderType('takeaway')} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all ${orderType === 'takeaway' ? 'bg-white dark:bg-[#101722] shadow-sm text-primary' : 'text-slate-500'}`}>
                    <span className="truncate text-sm font-bold">{vi.pos.takeAway}</span>
                 </label>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {cart.map((item, index) => (
                 <div key={index} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0" style={{ backgroundImage: `url('${item.product.img}')` }}></div>
                    <div className="flex flex-col flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <p className="text-slate-900 dark:text-white text-sm font-bold truncate pr-2">{item.product.name}</p>
                          <p className="text-slate-900 dark:text-white text-sm font-bold">{(item.product.price * item.quantity).toLocaleString()}</p>
                       </div>
                       <p className="text-slate-500 text-xs truncate mb-2">Size L, Ít đường</p>
                       <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                             <button onClick={() => updateQuantity(item.product.id, -1)} className="size-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-primary hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">remove</span>
                             </button>
                             <span className="text-sm font-semibold text-slate-900 dark:text-white w-4 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.product.id, 1)} className="size-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-primary hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                             </button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                             <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           <div className="bg-slate-50 dark:bg-[#0b1019] p-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col gap-2 mb-4">
                 <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
                    <span>{vi.pos.subtotal}</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
                    <span>{vi.pos.tax} (8%)</span>
                    <span>{tax.toLocaleString()}đ</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-900 dark:text-white text-lg font-bold mt-2">
                    <span>{vi.pos.total}</span>
                    <span>{total.toLocaleString()}đ</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-xl">percent</span>
                    <span className="font-semibold text-sm">{vi.pos.discount}</span>
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-xl">note_add</span>
                    <span className="font-semibold text-sm">{vi.pos.note}</span>
                 </button>
              </div>
              <button 
                onClick={clearCart}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
              >
                 <span className="text-lg font-bold">{vi.pos.pay}</span>
                 <span className="material-symbols-outlined">arrow_forward</span>
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default POS;
