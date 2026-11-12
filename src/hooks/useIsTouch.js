import { useEffect, useState } from 'react';
export function useIsTouch() {
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches);
  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouch(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return touch;
}
