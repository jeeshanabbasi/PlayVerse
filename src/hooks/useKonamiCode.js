import { useEffect, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function useKonamiCode(onActivated) {
  const indexRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key;
      const expected = KONAMI_CODE[indexRef.current];

      if (key.toLowerCase() === expected.toLowerCase()) {
        indexRef.current++;
        if (indexRef.current === KONAMI_CODE.length) {
          indexRef.current = 0;
          onActivated?.();
        }
      } else {
        // Reset or check if we are restarting the sequence
        indexRef.current = key.toLowerCase() === KONAMI_CODE[0].toLowerCase() ? 1 : 0;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onActivated]);
}
export default useKonamiCode;
