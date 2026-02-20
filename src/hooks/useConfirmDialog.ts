import React from 'react';

/**
 * Hook to manage confirm dialog state
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    severity?: 'warning' | 'error' | 'info';
    confirmColor?: 'primary' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    severity?: 'warning' | 'error' | 'info';
    confirmColor?: 'primary' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }) => {
    setDialogState({
      ...options,
      open: true,
    });
  };

  const hideConfirm = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirm = () => {
    dialogState.onConfirm();
    hideConfirm();
  };

  return {
    showConfirm,
    hideConfirm,
    confirmDialogProps: {
      ...dialogState,
      onConfirm: handleConfirm,
      onCancel: hideConfirm,
    },
  };
}
