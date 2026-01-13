
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Category } from '../../types';

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc")
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  categoryToEdit?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, categoryToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: categoryToEdit?.name || '' });
    }
  }, [isOpen, categoryToEdit, reset]);

  const onFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data.name);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <Input
          label="Tên danh mục"
          placeholder="VD: Cà phê, Trà sữa"
          {...register('name')}
          error={errors.name?.message}
          autoFocus
        />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {categoryToEdit ? "Lưu thay đổi" : "Tạo danh mục"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
