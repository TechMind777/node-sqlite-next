// hooks/useToast.ts

import { toast } from 'react-toastify';

const useToast = () => {
  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  return { showErrorToast, showSuccessToast };
};

export default useToast;
