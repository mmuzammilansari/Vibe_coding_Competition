import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion';
import { useStore } from '../store/useStore';

export default function Loader({ reduced }) {
  const done = useStore((s) => s.loaderDone);
  const setDone = useStore((s) => s.setLoaderDone);
  const [count, setCount] = useState(0);
  const root = useRef(null);
  const exiting = useRef(false);

  useEffect(() => {
    if (done || reduced) { if (!done) setDone(); return undefined; }
    const counter = { n: 0 };
    const tween = gsap.to(counter, { n: 100, duration: 1.45, ease: 'power2.out',
      onUpdate: () => setCount(Math.round(counter.n)), onComplete: finish });
    function finish() {
      if (exiting.current) return;
      exiting.current = true;
      gsap.to(root.current, { yPercent: -100, duration: 0.46, ease: 'power3.inOut',
        onComplete: setDone });
    }
    const fallback = window.setTimeout(finish, 1650);
    const shortcut = (event) => { if (event.key === 'Enter' || event.key === 'Escape') finish(); };
    window.addEventListener('keydown', shortcut);
    return () => { tween.kill(); window.clearTimeout(fallback); window.removeEventListener('keydown', shortcut); };
  }, [done, reduced, setDone]);

  if (done || reduced) return null;
  return <div className="loader" ref={root} role="dialog" aria-modal="true" aria-label="Loading the NOCTIS experience">
    <span className="mono">NOCTIS / SYSTEM BOOT</span>
    <div className="loader-mark">N<span>Ø</span>CTIS</div>
    <div className="loader-bottom"><span className="mono">ESTABLISHING PRESENCE</span>
      <strong className="loader-number">{String(count).padStart(3, '0')}</strong>
      <button type="button" onClick={() => {
        if (exiting.current) return;
        exiting.current = true;
        gsap.to(root.current, { yPercent: -100, duration: 0.28, onComplete: setDone });
      }}>SKIP INTRO</button></div>
  </div>;
}
