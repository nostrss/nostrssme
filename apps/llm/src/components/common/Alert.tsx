interface GameAlertProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function GameAlert({ isOpen, message, onClose }: GameAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>알림</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={onClose}>확인</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}