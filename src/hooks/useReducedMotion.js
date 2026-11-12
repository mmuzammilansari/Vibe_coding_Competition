import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export function useReducedMotion() {
  const [systemPrefers, setSystemPrefers] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const effectsOff = useStore((s) => s.effectsOff);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemPrefers(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return systemPrefers || effectsOff;
}
