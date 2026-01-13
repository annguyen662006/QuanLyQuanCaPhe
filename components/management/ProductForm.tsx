
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Control, FieldErrors } from 'react-hook-form';
import { X, UploadCloud } from 'lucide-react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Product, VariantGroup } from '../../types';
import { TrashIcon, PlusIcon } from '../Icons';
import { mockApi } from '../../lib/mockApi';
import { useUIStore } from '../../store';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  categoryId: string;
  onSuccess: () => void;
}

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  variantGroups: VariantGroup[];
}

// --- Internal Sub-Component for Nested Options ---
// Fix: Added explicit props interface and used React.FC to handle JSX special props like 'key' correctly
interface VariantGroupItemProps {
  control: Control<ProductFormData>;
  register: any;
  groupIndex: number;
  removeGroup: (index: number) => void;
  errors: FieldErrors<ProductFormData>;
}

const VariantGroupItem: React.FC<VariantGroupItemProps> = ({ 
  control, 
  register, 
  groupIndex, 
  removeGroup, 
  errors 
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variantGroups.${groupIndex}.options`
  });

  return (
    <div className="bg-[#1f2937] rounded-lg shadow-md p-4 border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
      {/* Group Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <Input
            label="Tên nhóm biến thể (VD: Size, Topping)"
            placeholder="Nhập tên nhóm"
            {...register(`variantGroups.${groupIndex}.name` as const, { required: "Tên nhóm là bắt buộc" })}
            error={errors.variantGroups?.[groupIndex]?.name?.message}
            className="bg-gray-700 border-gray-600 focus:border-blue-500"
          />
        </div>
        <div className="pt-8">
            <Button 
                type="button" 
                onClick={() => removeGroup(groupIndex)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 h-11 w-11 p-0"
                title="Xóa nhóm"
            >
                <TrashIcon size={18} />
            </Button>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 pl-4 border-l-2 border-slate-700 ml-2">
        {fields.map((option, optionIndex) => (
          <div key={option.id} className="flex items-start gap-3 animate-in slide-in-from-left-2 duration-200">
             <div className="flex-1">
                <Input
                    placeholder="Tên lựa chọn (VD: M, L)"
                    {...register(`variantGroups.${groupIndex}.options.${optionIndex}.name` as const, { required: true })}
                    className="bg-gray-700 border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
             </div>
             <div className="w-32">
                <Input
                    type="number"
                    placeholder="+ Giá"
                    {...register(`variantGroups.${groupIndex}.options.${optionIndex}.priceModifier` as const, { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600 focus:border-blue-500 h-10 text-sm font-mono"
                />
             </div>
             <button
                type="button"
                onClick={() => remove(optionIndex)}
                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
             >
                <TrashIcon size={16} />
             </button>
          </div>
        ))}

        <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ name: '', priceModifier: 0 })}
            className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 border-slate-600"
        >
            <PlusIcon size={14} className="mr-1.5" /> Thêm lựa chọn
        </Button>
      </div>
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, productToEdit, categoryId, onSuccess }) => {
  const isEditing = !!productToEdit;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const addToast = useUIStore(state => state.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, reset, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      variantGroups: []
    }
  });

  const { fields: variantFields, append: appendVariantGroup, remove: removeVariantGroup } = useFieldArray({
    control,
    name: "variantGroups"
  });

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        reset({
          name: productToEdit.name,
          price: productToEdit.price,
          description: productToEdit.description || '',
          variantGroups: productToEdit.variantGroups || []
        });
        setImagePreview(productToEdit.image || null);
      } else {
        reset({
          name: '',
          price: 0,
          description: '',
          variantGroups: []
        });
        setImagePreview(null);
      }
    }
  }, [isOpen, productToEdit, reset]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const onFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        category: categoryId,
        image: imagePreview || undefined, // In real app, this would be uploaded to a server
        sku: productToEdit?.sku || `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        stock: productToEdit?.stock || 100,
        status: productToEdit?.status || 'available'
      };

      if (isEditing && productToEdit) {
        await mockApi.updateProduct(productToEdit.id, payload);
        addToast('success', 'Đã cập nhật sản phẩm');
      } else {
        await mockApi.createProduct(payload as any);
        addToast('success', 'Đã thêm sản phẩm mới');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      addToast('danger', error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-[#1f2937] border border-slate-700"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#1f2937] shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>
        <button 
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[#1f2937]">
        <Tabs defaultValue="details" className="h-full flex flex-col">
          <div className="px-6 pt-6 shrink-0">
            <TabsList className="bg-slate-800 p-1 border border-slate-700">
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="variants">Tùy chọn biến thể</TabsTrigger>
              <TabsTrigger value="recipe">Công thức</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <TabsContent value="details" className="mt-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-2 space-y-5">
                  <Input 
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm"
                    {...register('name', { required: "Tên sản phẩm là bắt buộc" })}
                    error={errors.name?.message}
                  />
                  
                  <Input 
                    label="Giá bán"
                    type="number"
                    placeholder="0"
                    {...register('price', { valueAsNumber: true })}
                    className="font-mono"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-200">
                      Mô tả
                    </label>
                    <textarea 
                      {...register('description')}
                      className="flex min-h-[120px] w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all resize-none"
                      placeholder="Mô tả chi tiết sản phẩm..."
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm font-medium leading-none text-slate-200 block mb-2">
                    Hình ảnh
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transform scale-90 hover:scale-100 transition-all"
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 hover:text-blue-500 text-slate-400 cursor-pointer transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-12 h-12 mb-4" />
                        <p className="mb-2 text-sm font-semibold text-center px-4">Click to upload or drag and drop</p>
                        <p className="text-xs opacity-70">SVG, PNG, JPG or GIF</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="variants" className="mt-0 h-full">
              <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Cấu hình biến thể</h3>
                        <p className="text-sm text-slate-400">Thiết lập các tùy chọn như kích thước, đường, đá...</p>
                    </div>
                    <Button 
                        type="button"
                        onClick={() => appendVariantGroup({ name: '', options: [{ name: '', priceModifier: 0 }] })}
                        className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                    >
                        <PlusIcon size={18} className="mr-2" /> Thêm nhóm biến thể
                    </Button>
                </div>

                <div className="space-y-4">
                    {variantFields.map((field, index) => (
                        <VariantGroupItem 
                            key={field.id}
                            control={control}
                            register={register}
                            groupIndex={index}
                            removeGroup={removeVariantGroup}
                            errors={errors}
                        />
                    ))}
                    
                    {variantFields.length === 0 && (
                        <div className="p-12 text-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30">
                            <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4 text-slate-500">
                                <PlusIcon size={32} />
                            </div>
                            <h4 className="text-lg font-medium text-slate-300">Chưa có biến thể nào</h4>
                            <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                                Nhấn vào nút "Thêm nhóm biến thể" ở trên để bắt đầu tạo các tùy chọn cho sản phẩm.
                            </p>
                        </div>
                    )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recipe" className="mt-0 h-full">
              <div className="p-6 text-center text-slate-400">
                 <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-800/30">
                  <p>Công thức và định lượng sẽ được cập nhật sau.</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="px-6 py-4 border-t border-slate-700 bg-[#1f2937] flex items-center justify-end gap-3 shrink-0">
        <Button 
          variant="secondary" 
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
        >
          Hủy bỏ
        </Button>
        <Button 
          onClick={handleSubmit(onFormSubmit)}
          isLoading={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
        >
          {isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </Button>
      </div>
    </Modal>
  );
};

export default ProductForm;
