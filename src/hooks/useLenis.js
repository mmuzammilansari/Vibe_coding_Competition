import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, setActiveLenis } from '../lib/motion';

export function useLenis(reduced) {
  useEffect(() => {
    if (reduced) return undefined;
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false, duration: 1.15 });
    setActiveLenis(lenis);
    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000); // GSAP seconds -> Lenis milliseconds.
    lenis.on('scroll', update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', update);
      lenis.destroy();
      setActiveLenis(null);
      gsap.ticker.lagSmoothing(500, 33);
      ScrollTrigger.refresh();
    };
  }, [reduced]);
}
