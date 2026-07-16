import { cn } from '@utils/index';

function RequirementsColumn({ title, accent, rows }) {
  if (!rows?.length) return null;

  return (
    <div className="space-y-4">
      <h4
        className={cn(
          'text-xs font-semibold uppercase tracking-widest',
          accent,
        )}
      >
        {title}
      </h4>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <dt className="text-xs font-medium text-text-muted">{row.label}</dt>
            <dd className="text-sm text-text-secondary text-right sm:text-left">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function toRows(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) {
    return obj.map((item) => ({
      label: item.label ?? item.key,
      value: item.value,
    }));
  }
  return Object.entries(obj).map(([label, value]) => ({ label, value }));
}

export function SystemRequirementsCard({
  minimum,
  recommended,
  title = 'System Requirements',
  className,
}) {
  const minRows = toRows(minimum);
  const recRows = toRows(recommended);

  if (!minRows.length && !recRows.length) return null;

  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface p-5 md:p-6',
        'shadow-[var(--shadow-card)]',
        className,
      )}
    >
      {title && (
        <h3 className="text-heading-md text-text mb-5">{title}</h3>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <RequirementsColumn
          title="Minimum"
          accent="text-text-muted"
          rows={minRows}
        />
        <RequirementsColumn
          title="Recommended"
          accent="text-accent"
          rows={recRows}
        />
      </div>
    </section>
  );
}
