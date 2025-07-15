"use client"

import { useState, useCallback } from 'react'

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => Promise<void>
  type?: 'delete' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
}

export function useConfirmDialog() {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null)

  const showConfirmDialog = useCallback((
    title: string,
    description: string,
    onConfirm: () => Promise<void>,
    options?: {
      type?: 'delete' | 'warning' | 'danger'
      confirmText?: string
      cancelText?: string
    }
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      onConfirm,
      type: options?.type || 'delete',
      confirmText: options?.confirmText || 'Confirmar',
      cancelText: options?.cancelText || 'Cancelar'
    })
  }, [])

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null)
  }, [])

  return {
    confirmDialog,
    showConfirmDialog,
    closeConfirmDialog
  }
} 