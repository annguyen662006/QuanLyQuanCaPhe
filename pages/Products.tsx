import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Products: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
        <Header title="Quản lý Sản phẩm" />
        
        {/* Dashboard Layout */}
        <div className="flex-1 flex overflow-hidden p-4 lg:p-6 gap-6">
          {/* Left Column: Categories */}
          <div className="w-full lg:w-1/4 min-w-[280px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Danh mục</h3>
              <button className="size-8 rounded-lg bg-[#223149] hover:bg-primary text-white flex items-center justify-center transition-colors group">
                <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              <div className="group flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-primary/30 cursor-pointer">
                <span className="material-symbols-outlined text-primary/50 cursor-grab active:cursor-grabbing">drag_indicator</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Cà phê</p>
                  <p className="text-xs text-primary/80">12 sản phẩm</p>
                </div>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </div>
              
              {['Trà sữa (24 sp)', 'Sinh tố (8 sp)', 'Bánh ngọt (15 sp)', 'Topping (30 sp)'].map((cat, i) => (
                <div key={i} className="group flex items-center gap-3 p-3 rounded-xl bg-[#1e293b] border border-transparent hover:border-white/10 hover:bg-[#253248] cursor-pointer transition-all">
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 cursor-grab active:cursor-grabbing">drag_indicator</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white">{cat.split('(')[0].trim()}</p>
                    <p className="text-xs text-slate-500">{cat.split('(')[1].replace(')', '')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Table */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1e293b]/70 backdrop-blur-lg p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Danh mục:</span>
                <span className="text-white font-bold text-lg">Cà phê</span>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full ml-2">12</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#223149] text-white hover:bg-[#2c3f5d] transition-colors text-sm font-medium">
                   <span className="material-symbols-outlined text-[18px]">filter_list</span>
                   Lọc
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 transition-all text-sm font-bold">
                   <span className="material-symbols-outlined text-[20px]">add</span>
                   Thêm Sản phẩm
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-xl border border-white/5 bg-[#1e293b] flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#223149]/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium w-20">Hình ảnh</th>
                      <th className="p-4 font-medium">Tên sản phẩm</th>
                      <th className="p-4 font-medium">Mã SKU</th>
                      <th className="p-4 font-medium text-right">Giá bán</th>
                      <th className="p-4 font-medium text-center">Tồn kho</th>
                      <th className="p-4 font-medium text-center w-24">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {[
                      { name: 'Espresso Đá', sku: 'CF-001', price: '35,000 ₫', stock: 'Sẵn sàng', stockColor: 'bg-emerald-500/10 text-emerald-500', img: 'https://picsum.photos/100?random=1' },
                      { name: 'Latte Nóng', sku: 'CF-002', price: '45,000 ₫', stock: 'Sắp hết', stockColor: 'bg-yellow-500/10 text-yellow-500', img: 'https://picsum.photos/100?random=2' },
                      { name: 'Bạc Xỉu', sku: 'CF-003', price: '39,000 ₫', stock: 'Sẵn sàng', stockColor: 'bg-emerald-500/10 text-emerald-500', img: 'https://picsum.photos/100?random=3' },
                      { name: 'Cappuccino', sku: 'CF-004', price: '49,000 ₫', stock: 'Hết hàng', stockColor: 'bg-red-500/10 text-red-500', img: 'https://picsum.photos/100?random=4' },
                    ].map((item, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="size-12 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url('${item.img}')` }}></div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-xs text-slate-500">Mô tả ngắn...</p>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{item.sku}</td>
                        <td className="p-4 text-right font-bold text-emerald-400">{item.price}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.stockColor}`}>{item.stock}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                             <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                             </button>
                             <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-sm text-slate-400">Hiển thị 1-4 trên 12 sản phẩm</p>
                <div className="flex items-center gap-2">
                   <button className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5 disabled:opacity-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                   <button className="size-8 rounded-lg flex items-center justify-center bg-primary text-white text-sm font-bold">1</button>
                   <button className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white text-sm">2</button>
                   <button className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
