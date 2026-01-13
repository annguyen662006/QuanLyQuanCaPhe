import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserRole } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { vi } from '../../lang/vi';
import { Loader2 } from 'lucide-react';

// Form Data Interface
export interface StaffFormData {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

// Zod Validation Schema
const staffSchema = z.object({
  name: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  role: z.nativeEnum(UserRole),
  password: z.string().optional(),
}).refine((data) => {
  // If we assume this schema is reused for both create/edit, 
  // we can enforce password length manually if it is provided.
  if (data.password && data.password.length > 0 && data.password.length < 6) {
    return false;
  }
  return true;
}, {
  message: "Mật khẩu phải có ít nhất 6 ký tự",
  path: ["password"],
});

interface StaffFormProps {
  editingStaffMember?: User | null;
  onSubmit: (data: StaffFormData) => Promise<void>;
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ editingStaffMember, onSubmit, onClose }) => {
  const isEditing = !!editingStaffMember;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.CASHIER,
      password: '',
    }
  });

  // Populate form on edit mode
  useEffect(() => {
    if (editingStaffMember) {
      reset({
        name: editingStaffMember.name,
        email: editingStaffMember.email,
        role: editingStaffMember.role,
        password: '', // Don't populate password
      });
    } else {
      reset({
        name: '',
        email: '',
        role: UserRole.CASHIER,
        password: '',
      });
    }
  }, [editingStaffMember, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Name Field */}
        <Input
          label={vi.staff.name}
          placeholder="Nguyen Van A"
          {...register('name')}
          error={errors.name?.message}
          className="bg-gray-700 border-gray-600 focus:border-blue-500"
        />

        {/* Email Field */}
        <Input
          label={vi.staff.email}
          placeholder="staff@example.com"
          {...register('email')}
          error={errors.email?.message}
          className="bg-gray-700 border-gray-600 focus:border-blue-500"
        />

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            {vi.staff.role}
          </label>
          <select
            {...register('role')}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {vi.staff.roles[role] || role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs font-medium text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* Password Field - Only visible when creating new user */}
        {!isEditing && (
          <div className="space-y-1">
             <Input
              type="password"
              label={vi.staff.password}
              placeholder="••••••"
              {...register('password')}
              error={errors.password?.message}
              className="bg-gray-700 border-gray-600 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 italic">
              {vi.staff.passwordHelper}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200"
        >
          {vi.staff.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
        >
          {isEditing ? vi.staff.save : vi.staff.add}
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;