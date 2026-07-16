import { cn } from '@utils/index';

function formatPrice(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') return value;
  return `$${Number(value).toFixed(2)}`;
}

export function PriceCard({
  price,
  originalPrice,
  freeLabel = 'Free',
  className,
  size = 'md',
}) {
  const numericPrice = typeof price === 'number' ? price : Number(price);
  const isFree =
    price === 0 ||
    price === '0' ||
    price === 'Free' ||
    price === 'free' ||
    (Number.isFinite(numericPrice) && numericPrice === 0);

  const numericOriginal =
    typeof originalPrice === 'number' ? originalPrice : Number(originalPrice);
  const hasDiscount =
    !isFree &&
    Number.isFinite(numericPrice) &&
    Number.isFinite(numericOriginal) &&
    numericOriginal > numericPrice;

  const discountPercent = hasDiscount
    ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
    : null;

  const priceText = isFree ? freeLabel : formatPrice(price);
  const originalText = hasDiscount ? formatPrice(originalPrice) : null;

  const priceSize = size === 'lg' ? 'text-lg' : 'text-sm';
  const originalSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {discountPercent != null && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-primary-muted text-primary border border-primary/25">
          -{discountPercent}%
        </span>
      )}
      <div className="inline-flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-semibold tabular-nums',
            priceSize,
            isFree ? 'text-accent' : 'text-text',
          )}
        >
          {priceText}
        </span>
        {originalText && (
          <span
            className={cn(
              'tabular-nums text-text-muted line-through',
              originalSize,
            )}
          >
            {originalText}
          </span>
        )}
      </div>
    </div>
  );
}
