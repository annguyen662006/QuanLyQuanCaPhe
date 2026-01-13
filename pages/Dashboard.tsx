import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T2', value: 36 },
  { name: 'T3', value: 72 },
  { name: 'T4', value: 108 },
  { name: 'T5', value: 33 },
  { name: 'T6', value: 181 },
  { name: 'T7', value: 101 },
  { name: 'CN', value: 217 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative">
        <Header title="Dashboard Tổng quan" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background-light dark:bg-background-dark">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            {/* Date Filter */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold text-xl">Hôm nay</h3>
                <p className="text-[#90a7cb] text-sm">Thứ Ba, 12 Tháng 10, 2023</p>
              </div>
              <div className="flex bg-card-dark rounded-lg p-1">
                <button className="px-3 py-1.5 bg-[#314668] text-white text-xs font-medium rounded-md shadow-sm">Ngày</button>
                <button className="px-3 py-1.5 text-[#90a7cb] hover:text-white text-xs font-medium rounded-md transition-colors">Tuần</button>
                <button className="px-3 py-1.5 text-[#90a7cb] hover:text-white text-xs font-medium rounded-md transition-colors">Tháng</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Revenue */}
               <div className="flex flex-col gap-4 rounded-2xl p-5 bg-card-dark border border-[#314668] hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start">
                     <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <span className="material-symbols-outlined">payments</span>
                     </div>
                     <span className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span> +12%
                     </span>
                  </div>
                  <div>
                     <p className="text-[#90a7cb] text-sm font-medium mb-1">Doanh thu</p>
                     <p className="text-white text-2xl font-bold tracking-tight">125.000.000 ₫</p>
                  </div>
               </div>
               
               {/* Orders */}
               <div className="flex flex-col gap-4 rounded-2xl p-5 bg-card-dark border border-[#314668] hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start">
                     <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                        <span className="material-symbols-outlined">shopping_cart</span>
                     </div>
                     <span className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span> +5%
                     </span>
                  </div>
                  <div>
                     <p className="text-[#90a7cb] text-sm font-medium mb-1">Đơn hàng</p>
                     <p className="text-white text-2xl font-bold tracking-tight">342</p>
                  </div>
               </div>

               {/* Customers */}
               <div className="flex flex-col gap-4 rounded-2xl p-5 bg-card-dark border border-[#314668] hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start">
                     <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                        <span className="material-symbols-outlined">group</span>
                     </div>
                     <span className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span> +2%
                     </span>
                  </div>
                  <div>
                     <p className="text-[#90a7cb] text-sm font-medium mb-1">Khách hàng</p>
                     <p className="text-white text-2xl font-bold tracking-tight">1,205</p>
                  </div>
               </div>

               {/* Net Profit */}
               <div className="flex flex-col gap-4 rounded-2xl p-5 bg-card-dark border border-[#314668] hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start">
                     <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                     </div>
                     <span className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span> +8%
                     </span>
                  </div>
                  <div>
                     <p className="text-[#90a7cb] text-sm font-medium mb-1">Lợi nhuận</p>
                     <p className="text-white text-2xl font-bold tracking-tight">45.000.000 ₫</p>
                  </div>
               </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="xl:col-span-2 rounded-2xl border border-[#314668] bg-card-dark p-6 shadow-lg flex flex-col">
                <div className="flex justify-between items-end mb-6">
                   <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-semibold">Biểu đồ doanh thu</h3>
                      <p className="text-[#90a7cb] text-sm">Tổng quan hiệu suất bán hàng trong 7 ngày qua</p>
                   </div>
                   <div className="text-right">
                      <p className="text-white text-3xl font-bold">125.000.000 ₫</p>
                      <p className="text-success text-sm font-medium">+12% so với tuần trước</p>
                   </div>
                </div>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3c83f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3c83f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#314668" />
                      <XAxis dataKey="name" stroke="#90a7cb" axisLine={false} tickLine={false} dy={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#101723', border: '1px solid #314668', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3c83f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products */}
              <div className="xl:col-span-1 rounded-2xl border border-[#314668] bg-card-dark p-6 shadow-lg flex flex-col h-full">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                       <h3 className="text-white text-lg font-semibold">Sản phẩm bán chạy</h3>
                       <p className="text-[#90a7cb] text-sm">Top 5 tháng này</p>
                    </div>
                    <button className="text-primary text-sm font-semibold hover:text-blue-400">Xem tất cả</button>
                 </div>
                 <div className="flex flex-col gap-6 flex-1">
                    {[
                      { name: 'Cà phê sữa đá', percent: 85, color: 'bg-primary' },
                      { name: 'Bạc xỉu', percent: 65, color: 'bg-primary/80' },
                      { name: 'Trà đào', percent: 50, color: 'bg-primary/70' },
                      { name: 'Cam vắt', percent: 40, color: 'bg-primary/60' },
                      { name: 'Sinh tố bơ', percent: 35, color: 'bg-primary/50' },
                    ].map((item, index) => (
                      <div key={index} className="grid grid-cols-[auto_1fr] gap-4 items-center group cursor-pointer">
                        <p className="text-white text-sm font-medium text-right w-24 truncate">{item.name}</p>
                        <div className="h-8 flex-1 bg-[#101723] rounded-full overflow-hidden relative">
                           <div className={`${item.color} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 group-hover:bg-blue-400`} style={{ width: `${item.percent}%` }}>
                              <span className="text-[10px] text-white font-bold">{item.percent}%</span>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="rounded-2xl border border-[#314668] bg-card-dark overflow-hidden shadow-lg mb-6">
               <div className="p-6 border-b border-[#314668] flex justify-between items-center">
                  <h3 className="text-white text-lg font-semibold">Giao dịch gần đây</h3>
                  <button className="bg-[#314668] hover:bg-[#3c83f6] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                      Xuất báo cáo
                  </button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#101723] text-[#90a7cb] text-xs uppercase tracking-wider">
                           <th className="p-4 font-semibold">Mã đơn</th>
                           <th className="p-4 font-semibold">Khách hàng</th>
                           <th className="p-4 font-semibold">Thời gian</th>
                           <th className="p-4 font-semibold">Tổng tiền</th>
                           <th className="p-4 font-semibold">Trạng thái</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#314668] text-sm">
                        {[
                          { id: '#ORD-0012', customer: 'Nguyễn Văn A', time: '10:45 AM', total: '125.000 ₫', status: 'Hoàn thành', statusColor: 'text-success bg-success/20' },
                          { id: '#ORD-0013', customer: 'Khách lẻ', time: '10:52 AM', total: '45.000 ₫', status: 'Đang pha chế', statusColor: 'text-yellow-500 bg-yellow-500/20' },
                          { id: '#ORD-0014', customer: 'Trần Thị B', time: '11:05 AM', total: '320.000 ₫', status: 'Hoàn thành', statusColor: 'text-success bg-success/20' },
                        ].map((row, idx) => (
                           <tr key={idx} className="hover:bg-[#314668]/30 transition-colors">
                              <td className="p-4 font-medium text-primary">{row.id}</td>
                              <td className="p-4 text-white">{row.customer}</td>
                              <td className="p-4 text-[#90a7cb]">{row.time}</td>
                              <td className="p-4 text-white font-bold">{row.total}</td>
                              <td className="p-4">
                                 <span className={`${row.statusColor} px-2 py-1 rounded-md text-xs font-bold`}>{row.status}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
