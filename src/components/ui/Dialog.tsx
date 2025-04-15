// src/components/ui/Dialog.tsx
import React, { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg min-w-[500px] w-fit">
        {/* <button onClick={() => onOpenChange(false)} className="absolute top-2 right-2 text-xl">X</button> */}
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const DialogHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="text-xl font-semibold">{children}</div>
);

export const DialogTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="text-lg font-medium">{children}</div>
);

export const DialogFooter: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mt-4">{children}</div>
);
