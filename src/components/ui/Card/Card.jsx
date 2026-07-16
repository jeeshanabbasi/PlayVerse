import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn, cardHover } from '@utils/index';
import { usePrefersReducedMotion } from '@hooks/index';

export const Card = forwardRef(function Card(
  { hover = false, className, children, as: Component = 'div', ...props },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const classes = cn(
    'bg-surface border border-border rounded-xl shadow-[var(--shadow-card)]',
    className,
  );

  if (hover && !reduced) {
    return (
      <motion.div
        ref={ref}
        className={classes}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={cardHover}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

export const GlassCard = forwardRef(function GlassCard(
  { hover = false, className, children, ...props },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const classes = cn(
    'bg-surface/60 backdrop-blur-xl border border-border/80 rounded-xl',
    'shadow-[var(--shadow-soft)]',
    className,
  );

  if (hover && !reduced) {
    return (
      <motion.div
        ref={ref}
        className={classes}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={cardHover}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

export function FeatureCard({
  icon: Icon,
  title,
  description,
  hover = true,
  className,
  ...props
}) {
  return (
    <Card hover={hover} className={cn('p-5 md:p-6', className)} {...props}>
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      {title && <h3 className="text-heading-sm text-text">{title}</h3>}
      {description && (
        <p className="mt-2 text-body-md text-text-secondary">{description}</p>
      )}
    </Card>
  );
}

export function ProfileCard({
  avatar,
  name,
  subtitle,
  actions,
  hover = false,
  className,
  ...props
}) {
  return (
    <Card hover={hover} className={cn('p-5', className)} {...props}>
      <div className="flex items-start gap-4">
        {avatar && (
          <div className="shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
            {avatar}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {name && <p className="truncate text-heading-sm text-text">{name}</p>}
          {subtitle && (
            <p className="mt-0.5 truncate text-body-sm text-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}
