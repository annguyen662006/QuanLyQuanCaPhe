import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Shield, Key, Save, Edit2, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import { UserRole } from '../../types';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { mockApi } from '../../lib/mockApi';

// --- Zod Schemas ---
const ProfileDetailsSchema = z.object({
  name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ProfileDetailsForm = z.infer<typeof ProfileDetailsSchema>;
type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

const Profile: React.FC = () => {
  const { user, login } = useAuthStore();
  const addToast = useUIStore(state => state.addToast);
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('details');

  // --- Logic: Profile Details ---
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const detailsForm = useForm<ProfileDetailsForm>({
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  useEffect(() => {
    if (user) {
      detailsForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, detailsForm]);

  const onSaveDetails = async (data: ProfileDetailsForm) => {
    if (!user) return;
    setIsSavingDetails(true);
    try {
      const updatedUser = await mockApi.updateProfile(user.id, data);
      
      // Update Global Store
      login({ ...user, ...updatedUser });

      addToast('success', 'Cập nhật thông tin thành công!');
      setIsEditingDetails(false);
    } catch (error: any) {
      addToast('danger', error.message || 'Không thể cập nhật thông tin.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  // --- Logic: Change Password ---
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onChangePassword = async (data: ChangePasswordForm) => {
    if (!user) return;
    setIsSavingPassword(true);
    try {
      await mockApi.changePassword(user.id, data.currentPassword, data.newPassword);
      addToast('success', 'Đổi mật khẩu thành công!');
      passwordForm.reset();
    } catch (error: any) {
      const msg = error.message || 'Đã có lỗi xảy ra.';
      passwordForm.setError('currentPassword', { message: msg });
      addToast('danger', msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // --- Layout Logic ---
  const isAdmin = user?.role === UserRole.ADMIN;
  
  // Determine back path based on role
  const getBackPath = () => {
    switch (user?.role) {
      case UserRole.KITCHEN: return '/kds';
      case UserRole.CASHIER: return '/pos';
      default: return '/dashboard';
    }
  };

  const Content = () => (
    <div className="max-w-3xl mx-auto space-y-6">
       {!isAdmin && (
         <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(getBackPath())}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Cài đặt tài khoản</h1>
         </div>
       )}
       {isAdmin && <h1 className="text-3xl font-bold text-white tracking-tight">Cài đặt tài khoản</h1>}
      
      <Tabs defaultValue="details">
        <TabsList className="mb-6 bg-[#1f2937] border border-slate-700/50 p-1">
          <TabsTrigger value="details">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="size-20 rounded-full bg-slate-800 border-2 border-slate-600 overflow-hidden">
                  <img 
                    src={user?.avatar || "https://ui-avatars.com/api/?background=random"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      <Shield size={12} /> {user?.role}
                    </span>
                  </div>
                </div>
              </div>
              {!isEditingDetails && (
                <Button variant="outline" onClick={() => setIsEditingDetails(true)}>
                  <Edit2 size={16} className="mr-2" /> Chỉnh sửa
                </Button>
              )}
            </div>

            <form onSubmit={detailsForm.handleSubmit(onSaveDetails)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Họ và tên"
                  icon={<User size={18} />}
                  {...detailsForm.register('name')}
                  disabled={!isEditingDetails}
                  error={detailsForm.formState.errors.name?.message}
                />
                <Input 
                  label="Địa chỉ Email"
                  icon={<Mail size={18} />}
                  {...detailsForm.register('email')}
                  disabled={!isEditingDetails}
                  error={detailsForm.formState.errors.email?.message}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Vai trò (Không thể sửa)</label>
                  <div className="flex h-11 w-full items-center rounded-lg border border-slate-700 bg-[#111827]/50 px-3 text-sm text-slate-500 cursor-not-allowed">
                     <Shield size={18} className="mr-2" />
                     {user?.role}
                  </div>
                </div>
              </div>

              {isEditingDetails && (
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 animate-in slide-in-from-top-2">
                  <Button type="submit" isLoading={isSavingDetails}>
                    <Save size={18} className="mr-2" /> Lưu thay đổi
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditingDetails(false);
                      detailsForm.reset();
                    }}
                    disabled={isSavingDetails}
                  >
                    <X size={18} className="mr-2" /> Hủy bỏ
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Bảo mật</h2>
              <p className="text-slate-400 text-sm">
                Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.
              </p>
            </div>

            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6 max-w-lg">
              <Input 
                type="password"
                label="Mật khẩu hiện tại"
                placeholder="••••••••"
                icon={<Key size={18} />}
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message}
              />

              <div className="h-px bg-slate-700/50 my-4" />

              <Input 
                type="password"
                label="Mật khẩu mới"
                placeholder="••••••••"
                icon={<Key size={18} />}
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message}
              />

              <Input 
                type="password"
                label="Xác nhận mật khẩu mới"
                placeholder="••••••••"
                icon={<Key size={18} />}
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />

              <div className="pt-4">
                <Button type="submit" isLoading={isSavingPassword}>
                  <Save size={18} className="mr-2" /> Cập nhật mật khẩu
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // If Admin, use Dashboard Layout
  if (isAdmin) {
    return (
      <DashboardLayout title="Hồ sơ cá nhân">
        <Content />
      </DashboardLayout>
    );
  }

  // If KDS/POS, use Full Page Layout with Back Button
  return (
    <div className="min-h-screen bg-background-dark text-white p-6 md:p-10 flex flex-col">
       <header className="flex-none mb-4">
          {/* Header content handled inside Content component to keep alignment */}
       </header>
       <main className="flex-1">
          <Content />
       </main>
    </div>
  );
};

export default Profile;