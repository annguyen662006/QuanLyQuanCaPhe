import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon, ShieldIcon, PowerIcon } from '../../components/Icons';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StaffForm, { StaffFormData } from '../../components/management/StaffForm';
import { mockApi } from '../../lib/mockApi';
import { User, UserRole } from '../../types';
import { useAuthStore, useUIStore } from '../../store';
import { vi } from '../../lang/vi';

const StaffManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const addToast = useUIStore(state => state.addToast);
  
  // Data State
  const [staff, setStaff] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: User | null;
    action: 'activate' | 'deactivate';
  }>({
    isOpen: false,
    user: null,
    action: 'deactivate'
  });
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);

  // Fetch Staff
  const fetchStaff = useCallback(async () => {
    if (currentUser?.role !== UserRole.ADMIN) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await mockApi.getUsers();
      setStaff(data);
    } catch (err: any) {
      console.error("Failed to fetch staff", err);
      setError("Không thể tải danh sách nhân viên. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Initial Load
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // --- Handlers ---

  const handleAddStaff = () => {
    setEditingUser(null); // Reset to create mode
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user); // Set edit mode
    setIsModalOpen(true);
  };

  const handleToggleStatusClick = (user: User) => {
    const action = user.status === 'active' ? 'deactivate' : 'activate';
    setConfirmDialog({
        isOpen: true,
        user,
        action
    });
  };

  const executeStatusChange = async () => {
    const { user, action } = confirmDialog;
    if (!user) return;

    setIsProcessingStatus(true);
    
    // Optimistic Update
    const originalStaff = [...staff];
    const newStatus = action === 'activate' ? 'active' : 'inactive';
    
    setStaff(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));

    try {
        await mockApi.updateUser(user.id, { status: newStatus });
        addToast('success', `Đã ${action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} nhân viên ${user.name}.`);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (err: any) {
        // Revert Optimistic Update
        setStaff(originalStaff);
        addToast('danger', `Không thể cập nhật trạng thái: ${err.message}`);
    } finally {
        setIsProcessingStatus(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
  };

  // --- Form Submission Logic ---
  const handleSaveStaff = async (data: StaffFormData) => {
    try {
      if (editingUser) {
        // Edit Mode
        await mockApi.updateUser(editingUser.id, data);
        addToast('success', 'Cập nhật thông tin nhân viên thành công.');
      } else {
        // Create Mode
        await mockApi.createUser(data);
        addToast('success', 'Thêm nhân viên mới thành công.');
      }
      
      // Refresh Data & Close Modal
      await fetchStaff();
      setIsModalOpen(false);
      setEditingUser(null);
      
    } catch (err: any) {
      console.error(err);
      addToast('danger', err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      throw err;
    }
  };

  // Filter Logic
  const filteredStaff = staff.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Access Control
  if (currentUser?.role !== UserRole.ADMIN) {
      return (
          <DashboardLayout title="Quản lý nhân viên">
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                      <ShieldIcon size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Truy cập bị từ chối</h2>
                  <p className="text-slate-400 max-w-md">
                      Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với Quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.
                  </p>
                  <Button onClick={() => navigate('/dashboard')} variant="secondary">
                      Quay lại Dashboard
                  </Button>
              </div>
          </DashboardLayout>
      );
  }

  return (
    <DashboardLayout title={vi.staff.title}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold text-[#f9fafb]">{vi.staff.title}</h1>
              <p className="text-slate-400 text-sm mt-1">Quản lý tài khoản, vai trò và trạng thái hoạt động</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative w-full md:w-64">
                <Input 
                   placeholder={vi.common.search} 
                   className="pl-10 h-11"
                   icon={<SearchIcon size={18} />}
                   value={searchTerm}
                   onChange={handleSearch}
                />
             </div>
             <Button onClick={handleAddStaff} className="bg-blue-600 h-11 whitespace-nowrap">
                <PlusIcon className="mr-2 h-4 w-4" />
                {vi.staff.add}
             </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {error}
            </div>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-slate-700 bg-[#1f2937] overflow-hidden shadow-lg">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <div className="flex gap-2">
                     <Skeleton className="h-8 w-8 rounded-lg" />
                     <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#111827]/50">
                <TableRow className="hover:bg-transparent border-slate-700">
                  <TableHead className="w-[300px] text-gray-400 font-semibold">{vi.staff.name}</TableHead>
                  <TableHead className="text-gray-400 font-semibold">{vi.staff.role}</TableHead>
                  <TableHead className="text-gray-400 font-semibold">Ngày tham gia</TableHead>
                  <TableHead className="text-gray-400 font-semibold">{vi.common.status}</TableHead>
                  <TableHead className="text-right text-gray-400 font-semibold pr-6">{vi.common.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? (
                    filteredStaff.map((user) => (
                    <TableRow key={user.id} className="border-slate-700/50 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-100">{user.name}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-opacity-20 ${
                            user.role === UserRole.ADMIN ? 'bg-purple-500/10 text-purple-400 border-purple-500' :
                            user.role === UserRole.CASHIER ? 'bg-blue-500/10 text-blue-400 border-blue-500' :
                            user.role === UserRole.KITCHEN ? 'bg-orange-500/10 text-orange-400 border-orange-500' :
                            'bg-slate-500/10 text-slate-400 border-slate-500'
                        }`}>
                            {vi.staff.roles[user.role] || user.role}
                        </span>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                            {user.joinedDate || 'N/A'}
                        </TableCell>
                        <TableCell>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            user.status === 'active' 
                            ? 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20' 
                            : 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20'
                        }`}>
                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                            <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            title={vi.common.edit}
                            >
                            <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                            onClick={() => handleToggleStatusClick(user)}
                            className={`p-2 transition-colors rounded-lg focus:outline-none focus:ring-2 ${
                                user.status === 'active'
                                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 focus:ring-red-500/50'
                                : 'text-slate-400 hover:text-green-400 hover:bg-green-500/10 focus:ring-green-500/50'
                            }`}
                            title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            >
                                {user.status === 'active' ? <TrashIcon className="h-4 w-4" /> : <PowerIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-500">
                                <SearchIcon className="h-8 w-8 mb-2 opacity-50" />
                                <p>Không tìm thấy nhân viên nào phù hợp.</p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? vi.staff.editTitle : vi.staff.addTitle}
      >
        <StaffForm 
          editingStaffMember={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveStaff}
        />
      </Modal>

      {/* Confirm Status Change Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeStatusChange}
        title={confirmDialog.action === 'deactivate' ? "Vô hiệu hóa tài khoản?" : "Kích hoạt tài khoản?"}
        description={confirmDialog.action === 'deactivate' 
            ? `Bạn có chắc chắn muốn vô hiệu hóa nhân viên ${confirmDialog.user?.name}? Họ sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn kích hoạt lại nhân viên ${confirmDialog.user?.name}?`
        }
        confirmText={confirmDialog.action === 'deactivate' ? "Vô hiệu hóa" : "Kích hoạt"}
        variant={confirmDialog.action === 'deactivate' ? 'danger' : 'primary'}
        isLoading={isProcessingStatus}
      />

    </DashboardLayout>
  );
};

export default StaffManagement;