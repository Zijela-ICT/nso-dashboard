/* eslint-disable import/prefer-default-export */
import { toast } from 'sonner';

export const showToast = (
  message?: string,
  type: 'success' | 'error' | 'info' = 'success'
) => {
  toast[type](message, {
    position: 'top-right',
  });
};
