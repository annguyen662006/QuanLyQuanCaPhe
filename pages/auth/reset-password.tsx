import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock } from 'lucide-react';
import FullScreenLayout from '../../layouts/FullScreenLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store';

// Schema Validation
const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const addToast = useUIStore(state => state.addToast);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const handlePerformReset = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Mock API call to /api/auth/perform-reset
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock Token Validation
      // Use "MOCK_TOKEN_12345" as the valid token (logged in forgot-password.tsx)
      if (token !== 'MOCK_TOKEN_12345') { 
        throw new Error("Token không hợp lệ hoặc đã hết hạn.");
      }

      // Success Mock
      addToast('success', 'Mật khẩu đã được đặt lại thành công.');
      navigate('/');
      
    } catch (error: any) {
      const msg = error.message || "Đã có lỗi xảy ra";
      setApiError(msg);
      addToast('danger', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout>
      <div className="w-96 bg-[#1F2937] rounded-xl p-8 shadow-2xl border border-slate-700">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Đặt lại mật khẩu</h1>
          <p className="text-sm text-slate-400 mt-2">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit(handlePerformReset)} className="space-y-5">
          {apiError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center animate-pulse">
               {apiError}
            </div>
          )}

          <Input
            {...register('password')}
            type="password"
            placeholder="Mật khẩu mới"
            icon={<Lock size={18} />}
            error={errors.password?.message}
          />

          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            isLoading={isLoading}
          >
            Lưu mật khẩu mới
          </Button>
        </form>
      </div>
    </FullScreenLayout>
  );
};

export default ResetPassword;