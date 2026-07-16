export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateId(prefix = 'pv') {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export * from './motion';
