import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle } from 'lucide-react';
import React from 'react';
import { getDialogVariantStyles } from '@/utils/variants';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  icon?: React.ReactNode;
}

export const ConfirmDialog = React.memo(
  ({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    title,
    description,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'danger',
    icon,
  }: ConfirmDialogProps) => {
    const variantStyles = getDialogVariantStyles(variant);
    const displayIcon = icon || variantStyles.defaultIcon;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[85vh] w-[95%] max-w-md flex-col rounded-lg lg:max-w-lg">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="mt-4 flex items-center gap-2 lg:mt-0">
              <span className={variantStyles.iconColor}>{displayIcon}</span>
              {title}
            </DialogTitle>
            <DialogDescription className="text-left py-4 text-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          {
            (variant === 'danger' || variant === 'warning') && (
              <div className="flex-1 overflow-y-auto pr-2">
                <div>
                  {variant === 'danger' && (
                    <div className={`rounded-lg border p-4 ${variantStyles.bannerColor}`}>
                      <div className="flex items-center">
                        <XCircle className={`mr-2 h-5 w-5 ${variantStyles.bannerIconColor}`} />
                        <p className={`text-sm font-medium ${variantStyles.bannerTextColor}`}>
                          Tindakan ini tidak dapat dibatalkan.
                        </p>
                      </div>
                    </div>
                  )}

                  {variant === 'warning' && (
                    <div className={`rounded-lg border p-4 ${variantStyles.bannerColor}`}>
                      <div className="flex items-center">
                        <AlertTriangle className={`mr-2 h-5 w-5 ${variantStyles.bannerIconColor}`} />
                        <p className={`text-sm font-medium ${variantStyles.bannerTextColor}`}>
                          Harap tinjau tindakan ini dengan hati-hati.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          <DialogFooter className="flex-shrink-0 space-y-4">
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full lg:w-auto"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isProcessing}
                className={`w-full lg:w-auto ${variantStyles.buttonClass} text-primary-foreground transition-colors duration-200 focus:ring-2 focus:ring-opacity-50`}
              >
                {displayIcon &&
                  React.cloneElement(displayIcon as React.ReactElement, {})}
                {isProcessing ? 'Memproses...' : confirmText}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';