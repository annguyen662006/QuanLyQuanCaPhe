import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserIcon, Lock } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
import { UserRole as RoleEnum } from '../types';
import FullScreenLayout from '../layouts/FullScreenLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { vi } from '../lang/vi';
import { mockApi, seedUsers } from '../lib/mockApi';

// 1. Zod Schema
const LoginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc Email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu")
});

type LoginFormData = z.infer<typeof LoginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const addToast = useUIStore(state => state.addToast);
  const [isLoading, setIsLoading] = useState(false);

  // Seed users on mount to ensure data exists
  useEffect(() => {
    seedUsers();
  }, []);

  // 2. React Hook Form
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema)
  });

  // 3. Handle Login
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Use Mock API
      const user = await mockApi.login(data.username, data.password);

      // Determine redirect path
      let redirectPath = '/dashboard';
      if (user.role === RoleEnum.CASHIER) redirectPath = '/pos';
      if (user.role === RoleEnum.KITCHEN) redirectPath = '/kds';

      login(user);
      addToast('success', `Chào mừng trở lại, ${user.name}!`);
      navigate(redirectPath);

    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: err.message || vi.login.error
      });
      addToast('danger', err.message || vi.login.error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for dev buttons
  const handleQuickLogin = async (username: string) => {
    setIsLoading(true);
    try {
        const user = await mockApi.login(username); // No password needed for dev/mock logic specific method
        login(user);
        if(user.role === RoleEnum.ADMIN) navigate('/dashboard');
        if(user.role === RoleEnum.CASHIER) navigate('/pos');
        if(user.role === RoleEnum.KITCHEN) navigate('/kds');
    } catch (e) {
        addToast('danger', 'Quick login failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout>
      <div className="w-96 bg-[#1F2937] rounded-xl p-8 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 gap-3">
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-3xl">point_of_sale</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">{vi.login.title}</h1>
            <p className="text-sm text-slate-400 mt-1">{vi.login.subtitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {errors.root && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center animate-pulse">
               {errors.root.message}
            </div>
          )}

          <Input 
            {...register('username')}
            placeholder={vi.login.username}
            icon={<UserIcon size={18} />}
            error={errors.username?.message}
            autoComplete="username"
          />

          <div className="space-y-1">
            <Input 
              {...register('password')}
              type="password"
              placeholder={vi.login.password}
              icon={<Lock size={18} />}
              error={errors.password?.message}
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">
                {vi.login.forgot}
              </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
          >
            {vi.login.button}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Dev Quick Links */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-semibold mb-3">{vi.login.quickLogin}</p>
          <div className="flex gap-2 justify-center">
             <button onClick={() => handleQuickLogin('admin')} disabled={isLoading} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white border border-slate-700 disabled:opacity-50">Admin</button>
             <button onClick={() => handleQuickLogin('cashier')} disabled={isLoading} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white border border-slate-700 disabled:opacity-50">Thu ngân</button>
             <button onClick={() => handleQuickLogin('kitchen')} disabled={isLoading} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white border border-slate-700 disabled:opacity-50">Bếp</button>
          </div>
        </div>
      </div>
    </FullScreenLayout>
  );
};

export default Login;