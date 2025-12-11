import { AlertCircle, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

export const getDialogVariantStyles = (variant: string) => {
  switch (variant) {
    case 'danger':
      return {
        iconColor: 'text-destructive',
        buttonClass: 'bg-destructive hover:bg-destructive/90 focus:ring-destructive',
        bannerColor: 'border-destructive/20 bg-destructive/10',
        bannerTextColor: 'text-destructive',
        bannerIconColor: 'text-destructive',
        defaultIcon: <Trash2 className="h-5 w-5" />,
      };
    case 'warning':
      return {
        iconColor: 'text-yellow-600 dark:text-yellow-500',
        buttonClass: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:ring-yellow-600',
        bannerColor: 'border-yellow-600/20 bg-yellow-600/10 dark:border-yellow-500/20 dark:bg-yellow-500/10',
        bannerTextColor: 'text-yellow-700 dark:text-yellow-400',
        bannerIconColor: 'text-yellow-600 dark:text-yellow-500',
        defaultIcon: <AlertTriangle className="h-5 w-5" />,
      };
    case 'success':
      return {
        iconColor: 'text-green-600 dark:text-green-500',
        buttonClass: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-green-600',
        bannerColor: 'border-green-600/20 bg-green-600/10 dark:border-green-500/20 dark:bg-green-500/10',
        bannerTextColor: 'text-green-700 dark:text-green-400',
        bannerIconColor: 'text-green-600 dark:text-green-500',
        defaultIcon: <CheckCircle className="h-5 w-5" />,
      };
    case 'info':
    default:
      return {
        iconColor: 'text-blue-600 dark:text-blue-500',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-600',
        bannerColor: 'border-blue-600/20 bg-blue-600/10 dark:border-blue-500/20 dark:bg-blue-500/10',
        bannerTextColor: 'text-blue-700 dark:text-blue-400',
        bannerIconColor: 'text-blue-600 dark:text-blue-500',
        defaultIcon: <AlertCircle className="h-5 w-5" />,
      };
  }
};
