import { EmptyState } from '@components/common';
import { Gamepad2 } from 'lucide-react';

export function RoutePlaceholder() {
  return (
    <EmptyState
      icon={Gamepad2}
      title="Foundation Ready"
      description="PlayVerse architecture is initialized. Pages will be built on this foundation."
    />
  );
}
