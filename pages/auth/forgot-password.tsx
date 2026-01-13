import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import FullScreenLayout from '../../layouts/FullScreenLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store';

// Schema Validation
const ForgotPasswordSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const addToast = useUIStore(state => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const handleRequestReset = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Mock API call to /api/auth/request-reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // DEV ONLY: Log the token to console so developer can test
      console.log(`DEV ONLY: Reset token for ${data.email} is: MOCK_TOKEN_12345`);
      
      // Always show success state to prevent email enumeration
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      addToast('danger', 'Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout>
      <div className="w-96 bg-[#1F2937] rounded-xl p-8 shadow-2xl border border-slate-700">
        {!isSubmitted ? (
          <>
            {/* Form State */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Quên mật khẩu</h1>
              <p className="text-sm text-slate-400 mt-2">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleRequestReset)} className="space-y-6">
              <Input
                {...register('email')}
                type="email"
                placeholder="Email"
                icon={<Mail size={18} />}
                error={errors.email?.message}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                isLoading={isLoading}
              >
                Gửi yêu cầu
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors gap-1"
              >
                <ArrowLeft size={14} /> Quay lại Đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
                <CheckCircle size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Đã gửi yêu cầu</h1>
              <p className="text-sm text-slate-300">
                Nếu tài khoản với email đó tồn tại, một liên kết đặt lại đã được gửi đến hộp thư của bạn.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Vui lòng kiểm tra cả hộp thư rác (spam).
              </p>
              
              <Link to="/">
                <Button variant="secondary" className="w-full mt-4">
                  Quay lại Đăng nhập
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </FullScreenLayout>
  );
};

export default ForgotPassword;