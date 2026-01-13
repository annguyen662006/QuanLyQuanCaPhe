import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { UserRole } from '../types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === UserRole.ADMIN;

  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.KITCHEN: return '/kds';
      case UserRole.CASHIER: return '/pos';
      default: return '/dashboard';
    }
  };

  const SettingsContent = () => (
    <div className="max-w-[1000px] mx-auto space-y-8">
      {!isAdmin && (
         <div className="flex items-center gap-4 border-b border-[#314668]/30 pb-6">
            <button 
              onClick={() => navigate(getBackPath())}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl font-black tracking-tight">Cài đặt</h1>
                <p className="text-[#90a7cb] text-lg">Tuỳ chỉnh ứng dụng</p>
            </div>
         </div>
      )}

      {isAdmin && (
        <div className="flex flex-col gap-2 border-b border-[#314668]/30 pb-6">
            <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">Cài đặt Hệ thống</h1>
            <p className="text-[#90a7cb] text-lg">Quản lý thông tin chung và cấu hình ứng dụng</p>
        </div>
      )}
      
      {/* ADMIN ONLY CONTENT */}
      {isAdmin ? (
          <>
            <section className="space-y-6">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span> Thông tin chung
                </h2>
                <div className="bg-[#1f2937] rounded-xl border border-[#314668] p-6 md:p-8 space-y-6 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Tên cửa hàng</span>
                        <input className="w-full h-12 px-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" type="text" defaultValue="Modern Coffee" />
                        </label>
                        <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Khẩu hiệu (Slogan)</span>
                        <input className="w-full h-12 px-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" type="text" defaultValue="Hương vị đậm đà, không gian ấm cúng" />
                        </label>
                    </div>
                    <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Mô tả ngắn</span>
                        <textarea className="w-full p-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none resize-none h-32"></textarea>
                    </label>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">pin_drop</span> Địa điểm & Liên hệ
                </h2>
                <div className="bg-[#1f2937] rounded-xl border border-[#314668] p-6 md:p-8 space-y-6 shadow-xl">
                    <div className="grid grid-cols-1 gap-6">
                        <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Địa chỉ cửa hàng</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#90a7cb]">location_on</span>
                            <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" type="text" defaultValue="123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
                        </div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Số điện thoại</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#90a7cb]">call</span>
                            <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" type="tel" defaultValue="090 123 4567" />
                        </div>
                        </label>
                        <label className="flex flex-col gap-2">
                        <span className="text-white text-sm font-medium">Email liên hệ</span>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#90a7cb]">mail</span>
                            <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-background-dark border border-[#314668] text-white placeholder-[#90a7cb] focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" type="email" defaultValue="contact@moderncoffee.com" />
                        </div>
                        </label>
                    </div>
                </div>
            </section>
          </>
      ) : (
          /* NON-ADMIN CONTENT */
          <div className="bg-[#1f2937] rounded-xl border border-[#314668] p-8 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-slate-800 text-slate-400">
                  <span className="material-symbols-outlined text-4xl">settings</span>
              </div>
              <h3 className="text-xl font-bold text-white">Cài đặt ứng dụng</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                  Hiện tại không có cài đặt cụ thể nào cho vai trò <b>{user?.role}</b> của bạn. Vui lòng liên hệ Quản trị viên nếu bạn cần thay đổi thông tin cửa hàng.
              </p>
          </div>
      )}
    </div>
  );

  // Layout Logic
  if (isAdmin) {
      return (
        <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
            <Header title="Cài đặt Hệ thống" />
            <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-24">
                <SettingsContent />
            </div>
            {/* Save Button for Admin */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#101722]/95 backdrop-blur-sm border-t border-[#314668]/30 p-4 md:px-10 z-20">
                <div className="max-w-[1000px] mx-auto flex items-center justify-end gap-4">
                    <button className="px-6 py-3 rounded-lg text-white font-medium hover:bg-[#1f2937] transition-colors">Hủy bỏ</button>
                    <button className="px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all transform active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">save</span> Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
        </div>
      );
  }

  // Non-Admin Layout
  return (
    <div className="min-h-screen bg-background-dark p-6 md:p-10 flex flex-col">
        <SettingsContent />
    </div>
  );
};

export default Settings;