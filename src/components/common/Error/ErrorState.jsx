import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@utils/index';

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showHomeLink = true,
  className,
}) {
  return (
    <div
      className={cn('flex flex-col items-center text-center gap-4 py-12 px-4', className)}
      role="alert"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-error/10 border border-error/20">
        <AlertTriangle className="w-7 h-7 text-error" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-heading-md text-text">{title}</h2>
        <p className="text-body-md">{message}</p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        )}
        {showHomeLink && (
          <Link to="/" className="btn-ghost">
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
}
