'use client';

import { Dialog, DialogHeader} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <div className="p-5">
        <DialogHeader>
          <p>{title}</p>
        </DialogHeader>
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xác nhận
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
