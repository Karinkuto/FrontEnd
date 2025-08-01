import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

type NotificationOptions = {
  /** Duration in milliseconds */
  duration?: number;
  /** Additional CSS class name */
  className?: string;
  /** Callback when notification is clicked */
  onClick?: () => void;
};

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private notify(
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ) {
    const { duration, className, onClick } = options;

    const toastOptions = {
      duration,
      className: `notification ${type} ${className || ''}`.trim(),
      onClick,
    };

    switch (type) {
      case 'success':
        return toast.success(message, { ...toastOptions, duration: 3000 });
      case 'error':
        return toast.error(message, { ...toastOptions, duration: 5000 });
      case 'warning':
        return toast.warning(message, { ...toastOptions, duration: 4000 });
      case 'info':
        return toast.info(message, { ...toastOptions, duration: 3000 });
      case 'loading':
        return toast.loading(message, { ...toastOptions, duration: 0 });
      default:
        return toast(message, toastOptions);
    }
  }

  success(message: string, options: NotificationOptions = {}) {
    return this.notify('success', message, options);
  }

  error(message: string, options: NotificationOptions = {}) {
    return this.notify('error', message, options);
  }

  warning(message: string, options: NotificationOptions = {}) {
    return this.notify('warning', message, options);
  }

  info(message: string, options: NotificationOptions = {}) {
    return this.notify('info', message, options);
  }

  loading(message: string, options: NotificationOptions = {}) {
    return this.notify('loading', message, {
      duration: 0, // Don't auto-dismiss loading toasts
      ...options,
    });
  }

  dismiss(toastId?: string | number) {
    toast.dismiss(toastId);
  }

  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    },
    options: NotificationOptions = {}
  ): Promise<T> {
    const toastId = this.loading(messages.loading, {
      ...options,
      duration: 0,
    });

    try {
      const result = await promise;

      const successMessage =
        typeof messages.success === 'function'
          ? messages.success(result)
          : messages.success;

      this.dismiss(toastId);
      this.success(successMessage, {
        ...options,
        duration: 3000,
      });

      return result;
    } catch (error) {
      const errorMessage = (() => {
        if (!messages.error) return 'An unexpected error occurred';
        return typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error;
      })();

      this.dismiss(toastId);
      this.error(errorMessage, {
        ...options,
        duration: 5000,
      });

      throw error;
    }
  }
}

export const notification = NotificationService.getInstance();

export const { success, error, warning, info, loading, promise, dismiss } =
  notification;
