export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

export function createVirtualJoystickState() {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    pause: false,
  };
}
