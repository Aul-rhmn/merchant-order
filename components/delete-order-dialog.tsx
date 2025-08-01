"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteOrderDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteOrderDialog({ isOpen, onClose, onConfirm }: DeleteOrderDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="mx-4 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">
            Are you sure you want to delete this order?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            This action cannot be undone. This will permanently delete the order and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
