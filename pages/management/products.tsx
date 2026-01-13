
import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import CategoryList from '../../components/management/CategoryList';
import CategoryModal from '../../components/management/CategoryModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/Icons';
import { mockApi } from '../../lib/mockApi';
import { Category, Product } from '../../types';
import { useUIStore } from '../../store';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import ProductForm from '../../components/management/ProductForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const ProductManagement: React.FC = () => {
  // State for Categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // State for Products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // State for Product Modal (Form)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State for Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete_category' | 'delete_product';
    data: any;
  }>({ isOpen: false, type: 'delete_product', data: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const addToast = useUIStore(state => state.addToast);

  // --- Fetch Data ---

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const data = await mockApi.getCategories();
      setCategories(data);
      
      // Select first category if none selected
      if (!selectedCategoryId && data.length > 0) {
        setSelectedCategoryId(data[0].id);
      } else if (selectedCategoryId && !data.find(c => c.id === selectedCategoryId) && data.length > 0) {
        // If selected category was deleted, select first
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
      addToast('danger', 'Không thể tải danh sách danh mục');
    } finally {
      setIsLoadingCategories(false);
    }
  }, [addToast, selectedCategoryId]);

  const fetchProducts = useCallback(async () => {
    if (!selectedCategoryId) {
        setProducts([]);
        return;
    }

    setIsLoadingProducts(true);
    try {
        const data = await mockApi.getProducts(selectedCategoryId);
        setProducts(data);
    } catch (error) {
        console.error("Failed to load products", error);
        addToast('danger', 'Không thể tải danh sách sản phẩm');
    } finally {
        setIsLoadingProducts(false);
    }
  }, [selectedCategoryId, addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Category Actions ---

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategoryRequest = (category: Category) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete_category',
      data: category
    });
  };

  const onSaveCategory = async (name: string) => {
    try {
      if (editingCategory) {
        await mockApi.updateCategory(editingCategory.id, name);
        addToast('success', 'Đã cập nhật danh mục');
      } else {
        await mockApi.createCategory(name);
        addToast('success', 'Đã tạo danh mục mới');
      }
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      addToast('danger', error.message || 'Lỗi khi lưu danh mục');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    // Optimistic Update
    const originalCategories = [...categories];
    const newCategories = Array.from(categories);
    const [reorderedItem] = newCategories.splice(sourceIndex, 1);
    newCategories.splice(destinationIndex, 0, reorderedItem);

    setCategories(newCategories);

    try {
        await mockApi.reorderCategories(newCategories.map(c => c.id));
    } catch (error) {
        console.error("Failed to reorder", error);
        setCategories(originalCategories);
        addToast('danger', 'Không thể lưu thứ tự danh mục');
    }
  };

  // --- Product Actions ---

  const handleAddProduct = () => {
      setEditingProduct(null);
      setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
      setEditingProduct(product);
      setIsProductModalOpen(true);
  };

  const handleDeleteProductRequest = (product: Product) => {
      setConfirmDialog({
        isOpen: true,
        type: 'delete_product',
        data: product
      });
  };

  // --- Common Confirm Delete ---

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (confirmDialog.type === 'delete_category') {
        await mockApi.deleteCategory(confirmDialog.data.id);
        addToast('success', 'Đã xóa danh mục');
        fetchCategories();
        // If we deleted the current category, fetchCategories handles re-selection
      } else {
        await mockApi.deleteProduct(confirmDialog.data.id);
        addToast('success', 'Đã xóa sản phẩm');
        fetchProducts();
        // Update category count implicitly by refetching categories or manually? 
        // fetchCategories will recount.
        fetchCategories(); 
      }
    } catch (error: any) {
      addToast('danger', error.message || 'Không thể xóa');
    } finally {
      setIsDeleting(false);
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <DashboardLayout title="Quản lý Sản phẩm">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] md:h-auto">
        {/* Left Column: Categories */}
        <div className="w-full md:w-[30%] flex-shrink-0 bg-gray-800 rounded-lg p-6 flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Danh mục</h2>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <CategoryList 
              categories={categories}
              isLoading={isLoadingCategories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategoryRequest}
            />
          </DragDropContext>
        </div>

        {/* Right Column: Products */}
        <div className="flex-grow bg-gray-800 rounded-lg p-6 flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] border border-slate-700 overflow-hidden">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-xl font-semibold text-white">Sản phẩm</h2>
            <Button variant="primary" onClick={handleAddProduct} disabled={!selectedCategoryId}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            {!selectedCategoryId ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                    Vui lòng chọn hoặc tạo một danh mục để bắt đầu
                </div>
            ) : isLoadingProducts ? (
                <div className="space-y-4">
                     <div className="flex gap-4 p-4 border-b border-gray-700">
                         <Skeleton className="h-4 w-12" />
                         <Skeleton className="h-4 w-1/3" />
                         <Skeleton className="h-4 w-1/4" />
                         <Skeleton className="h-4 w-20" />
                     </div>
                     {[1, 2, 3].map((i) => (
                         <div key={i} className="flex gap-4 p-4 items-center">
                             <Skeleton className="h-12 w-12 rounded-md" />
                             <div className="flex-1 space-y-2">
                                 <Skeleton className="h-4 w-1/2" />
                             </div>
                             <Skeleton className="h-4 w-20" />
                         </div>
                     ))}
                 </div>
            ) : products.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                     <span className="material-symbols-outlined text-4xl opacity-50">inventory_2</span>
                     <p>Chưa có sản phẩm nào trong danh mục này</p>
                 </div>
            ) : (
                <Table>
                    <TableHeader className="bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                        <TableRow className="border-gray-700 hover:bg-transparent">
                            <TableHead className="w-[80px]">Hình ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Giá bán</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <TableCell>
                                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-900 border border-gray-700">
                                        <img 
                                            src={product.image || 'https://via.placeholder.com/150'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img';
                                            }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-gray-200">
                                    <div className="flex flex-col">
                                        <span>{product.name}</span>
                                        {product.sku && <span className="text-xs text-slate-500 font-mono">{product.sku}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-blue-400 font-medium">
                                    {product.price.toLocaleString()}đ
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
                                            onClick={() => handleEditProduct(product)}
                                            title="Sửa"
                                        >
                                            <PencilIcon size={16} />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleDeleteProductRequest(product)}
                                            title="Xóa"
                                        >
                                            <TrashIcon size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductForm 
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        productToEdit={editingProduct}
        categoryId={selectedCategoryId || ''}
        onSuccess={() => { fetchProducts(); fetchCategories(); }}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        onSubmit={onSaveCategory}
        categoryToEdit={editingCategory}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={confirmDialog.type === 'delete_category' ? "Xóa danh mục?" : "Xóa sản phẩm?"}
        description={
            confirmDialog.type === 'delete_category'
            ? `Bạn có chắc muốn xóa danh mục "${confirmDialog.data?.name}"? Các sản phẩm bên trong cũng sẽ bị xóa.`
            : `Bạn có chắc muốn xóa sản phẩm "${confirmDialog.data?.name}"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa vĩnh viễn"
        variant="danger"
        isLoading={isDeleting}
      />
      
    </DashboardLayout>
  );
};

export default ProductManagement;
