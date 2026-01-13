import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import FullScreenLayout from '../../layouts/FullScreenLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockApi } from '../../lib/mockApi';

// 1. Zod Schema
const RegisterSchema = z.object({
  name: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const addToast = useUIStore(state => state.addToast);
  const [isLoading, setIsLoading] = useState(false);

  // 2. React Hook Form
  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema)
  });

  // 3. Handle Register
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Use Mock API
      const user = await mockApi.register({
          name: data.name,
          email: data.email,
          password: data.password
      });

      login(user);
      addToast('success', 'Đăng ký thành công!');
      navigate('/dashboard');

    } catch (error: any) {
      setError('email', { 
        type: 'manual', 
        message: error.message || 'Đăng ký thất bại'
      });
      addToast('danger', error.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout>
      <div className="w-96 bg-[#1F2937] rounded-xl p-8 shadow-2xl border border-slate-700">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Tạo tài khoản</h1>
          <p className="text-sm text-slate-400 mt-2">Nhập thông tin để đăng ký thành viên mới</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <Input 
            {...register('name')}
            placeholder="Họ và Tên"
            icon={<User size={18} />}
            error={errors.name?.message}
          />

          <Input 
            {...register('email')}
            type="email"
            placeholder="Email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
          />

          <Input 
            {...register('password')}
            type="password"
            placeholder="Mật khẩu"
            icon={<Lock size={18} />}
            error={errors.password?.message}
          />

          <Input 
            {...register('confirmPassword')}
            type="password"
            placeholder="Xác nhận mật khẩu"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
          />

          <Button 
            type="submit" 
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all" 
            isLoading={isLoading}
          >
            Đăng ký
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </FullScreenLayout>
  );
};

export default Register;