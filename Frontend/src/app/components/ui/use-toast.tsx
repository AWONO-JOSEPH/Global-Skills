import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description: description,
      });
    } else {
      sonnerToast.success(title, {
        description: description,
      });
    }
  };

  return { toast };
}
