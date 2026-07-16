export function formatScore(value) {
  const n = Math.max(0, Number(value) || 0);
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatLastPlayed(timestamp) {
  if (!timestamp) return 'Never';
  const diff = Date.now() - Number(timestamp);
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
