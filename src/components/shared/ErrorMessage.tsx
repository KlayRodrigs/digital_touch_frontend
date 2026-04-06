import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, className, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center',
        className,
      )}
    >
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium underline underline-offset-4 hover:opacity-80"
        >
          Try again
        </button>
      )}
    </div>
  );
}
