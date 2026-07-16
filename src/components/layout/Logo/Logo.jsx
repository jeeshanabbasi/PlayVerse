import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { APP_NAME } from '@constants/navigation';
import { cn } from '@utils/index';

export function Logo({ className, showText = true, size = 'md' }) {
  const iconSizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-11 h-11' };
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5 group', className)}
      aria-label={`${APP_NAME} home`}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20',
          'group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-250',
          iconSizes[size],
        )}
      >
        <Gamepad2 className="w-1/2 h-1/2 text-primary" aria-hidden="true" />
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight text-text', textSizes[size])}>
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
