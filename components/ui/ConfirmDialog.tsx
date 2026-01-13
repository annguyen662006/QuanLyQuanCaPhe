import React from 'react';
import Modal from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = 'primary',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {variant === 'danger' && (
            <div className="p-3 bg-red-500/10 rounded-full text-red-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
          )}
           {variant === 'warning' && (
            <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-slate-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'} // Map to existing Button variants, forcing primary style but we can style color via className if needed
            onClick={onConfirm}
            isLoading={isLoading}
            className={
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' : 
                variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-900/20' : 
                'bg-blue-600 hover:bg-blue-700'
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;