"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  // Tách riêng classNames để tránh ESLint lỗi "unused variable"
  const toastClassNames = {
    toast:
      "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
    description: "group-[.toast]:text-muted-foreground",
    actionButton:
      "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
    cancelButton:
      "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{ classNames: toastClassNames }}
      {...props}
    />
  );
};

export { Toaster };
