import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Employees: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
        <Header title="Quản lý Nhân viên" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="relative w-full lg:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm" placeholder="Tìm theo tên, email hoặc mã NV..." type="text"/>
              </div>
              <div className="flex gap-2 overflow-x-auto w-full lg:w-auto">
                 <button className="flex items-center px-4 py-2 rounded-xl bg-slate-200 dark:bg-surface-dark border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm whitespace-nowrap">
                    <span className="material-symbols-outlined text-[18px] mr-2">filter_list</span> Lọc
                 </button>
                 <button className="px-4 py-2 rounded-xl bg-primary text-white font-medium text-sm shadow-md">Tất cả</button>
                 <button className="px-4 py-2 rounded-xl bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm">Quản lý</button>
                 <button className="px-4 py-2 rounded-xl bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm">Thu ngân</button>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                          <th className="p-4 pl-6 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase w-16">#</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Họ và tên</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Vai trò</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Liên hệ</th>
                          <th className="p-4 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Trạng thái</th>
                          <th className="p-4 pr-6 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase text-right">Hành động</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                       {[
                         { id: '001', name: 'Nguyễn Văn An', role: 'Quản lý', contact: '0901 234 567', status: 'Hoạt động', img: 'https://picsum.photos/100?random=10' },
                         { id: '002', name: 'Trần Thị Bình', role: 'Thu ngân', contact: '0912 345 678', status: 'Hoạt động', img: 'https://picsum.photos/100?random=11' },
                         { id: '003', name: 'Lê Văn Cường', role: 'Phục vụ', contact: '0987 654 321', status: 'Nghỉ phép', img: 'https://picsum.photos/100?random=12' },
                         { id: '004', name: 'Phạm Minh', role: 'Thu ngân', contact: '0999 888 777', status: 'Đã nghỉ', img: '' }, // No image case
                       ].map((emp, idx) => (
                         <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 pl-6 text-slate-500 font-mono text-xs">{emp.id}</td>
                            <td className="p-4">
                               <div className="flex items-center gap-4">
                                  {emp.img ? (
                                    <img src={emp.img} alt={emp.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover" />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold text-sm flex items-center justify-center border-2 border-white dark:border-slate-700">
                                       {emp.name.split(' ').pop()?.substring(0,2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                     <p className="text-sm font-semibold text-slate-900 dark:text-white">{emp.name}</p>
                                     <p className="text-xs text-slate-500 md:hidden">...</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-4">
                               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                  {emp.role}
                               </div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-sm text-slate-600 dark:text-slate-300">{emp.contact}</td>
                            <td className="p-4">
                               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  emp.status === 'Hoạt động' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                                  emp.status === 'Nghỉ phép' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' :
                                  'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                               }`}>
                                  {emp.status}
                               </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                  <button className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10"><span className="material-symbols-outlined text-[20px]">delete</span></button>
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

export default Employees;
