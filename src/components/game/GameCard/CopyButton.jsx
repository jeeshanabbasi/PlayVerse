import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-primary hover:border-primary/40 transition-all duration-200`}
      title="Copy game link"
      aria-label="Copy game link"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}

export default CopyButton;
