import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Inventory: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
        <Header title="Quản lý Kho hàng" />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-[1400px] flex flex-col gap-8 pb-10">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
               <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold text-white tracking-tight">Kho hàng</h1>
                  <p className="text-slate-400 text-base">Theo dõi tồn kho, giá nhập và quản lý nhà cung cấp.</p>
               </div>
               <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-dark border border-[#334155] text-white font-medium hover:bg-white/5 transition-all text-sm h-11">
                     <span className="material-symbols-outlined text-[20px]">download</span>
                     <span>Xuất báo cáo</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 text-sm h-11">
                     <span className="material-symbols-outlined text-[20px]">add</span>
                     <span>Thêm mặt hàng</span>
                  </button>
               </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-card-dark p-4 rounded-2xl border border-[#334155] shadow-sm">
               <div className="lg:col-span-5 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                  </div>
                  <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-background-dark text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 text-sm h-11 transition-all" placeholder="Tìm kiếm theo tên hoặc mã SKU..." type="text"/>
               </div>
               <div className="lg:col-span-3">
                  <div className="relative">
                     <select className="block w-full pl-3 pr-10 py-2.5 border-none rounded-xl bg-background-dark text-white text-sm h-11 focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                        <option value="">Tất cả nhà cung cấp</option>
                        <option value="caphe">Cà phê Trung Nguyên</option>
                        <option value="sua">Vinamilk</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined">expand_more</span>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-3">
                  <div className="relative">
                     <select className="block w-full pl-3 pr-10 py-2.5 border-none rounded-xl bg-background-dark text-white text-sm h-11 focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                        <option value="">Trạng thái tồn kho</option>
                        <option value="instock">Còn hàng</option>
                        <option value="lowstock">Sắp hết hàng</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined">expand_more</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="bg-card-dark rounded-2xl border border-[#334155] overflow-hidden shadow-sm flex flex-col">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-background-dark/50 border-b border-[#334155] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                           <th className="p-4 pl-6 w-12"><input type="checkbox" className="rounded border-slate-600 bg-transparent text-primary focus:ring-0 size-4"/></th>
                           <th className="p-4 min-w-[250px]">Sản phẩm</th>
                           <th className="p-4">SKU</th>
                           <th className="p-4 text-center">Tồn kho</th>
                           <th className="p-4 text-right">Giá nhập</th>
                           <th className="p-4 text-right">Giá bán</th>
                           <th className="p-4 text-right pr-6">Hành động</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#334155] text-sm text-slate-300">
                        {[
                          { name: 'Hạt Arabica Cầu Đất', sku: 'CF-A01', stock: 150, stockColor: 'bg-emerald-500/10 text-emerald-400', buy: '250.000 ₫', sell: '450.000 ₫', img: 'https://picsum.photos/100?random=20' },
                          { name: 'Sữa tươi thanh trùng', sku: 'MK-023', stock: 12, stockColor: 'bg-amber-500/10 text-amber-400', buy: '30.000 ₫', sell: '45.000 ₫', img: 'https://picsum.photos/100?random=21' },
                          { name: 'Đường cát trắng', sku: 'SU-882', stock: 0, stockColor: 'bg-red-500/10 text-red-400', buy: '18.000 ₫', sell: '25.000 ₫', img: 'https://picsum.photos/100?random=22' },
                          { name: 'Ly nhựa 500ml', sku: 'PL-112', stock: 450, stockColor: 'bg-emerald-500/10 text-emerald-400', buy: '500 ₫', sell: 'N/A', img: 'https://picsum.photos/100?random=23' },
                        ].map((row, idx) => (
                          <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                             <td className="p-4 pl-6"><input type="checkbox" className="rounded border-slate-600 bg-transparent text-primary focus:ring-0 size-4"/></td>
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-10 w-10 rounded-lg bg-background-dark bg-cover bg-center shrink-0 border border-[#334155]" style={{ backgroundImage: `url('${row.img}')` }}></div>
                                   <div className="flex flex-col">
                                      <span className="font-medium text-white group-hover:text-primary transition-colors">{row.name}</span>
                                      <span className="text-xs text-slate-500">Mô tả...</span>
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 font-mono text-slate-400">{row.sku}</td>
                             <td className="p-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${row.stockColor} border-opacity-20`}>{row.stock}</span>
                             </td>
                             <td className="p-4 text-right font-medium">{row.buy}</td>
                             <td className="p-4 text-right font-bold text-white">{row.sell}</td>
                             <td className="p-4 text-right pr-6">
                                <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="p-1.5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                   <button className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
