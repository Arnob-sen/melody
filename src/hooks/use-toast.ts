import { toast } from "sonner";

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    error: toast.error,
    success: toast.success,
    loading: toast.loading,
    promise: toast.promise,
  };
}