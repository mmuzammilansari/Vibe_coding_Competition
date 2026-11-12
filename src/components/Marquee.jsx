import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';

const line = '620 NM TORQUE   /   800V ARCHITECTURE   /   0 EMISSIONS   /   ALL ELECTRIC   /   ';
export default function Marquee({ reduced }) {
  const track = useRef(null);
  useEffect(() => {
    if (reduced || !track.current) return undefined;
    let velocity = 1;
    const tween = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
    const observer = ScrollTrigger.create({ onUpdate: (self) => { velocity = Math.min(3, Math.max(1, Math.abs(self.getVelocity()) / 1100)); tween.timeScale(velocity); } });
    return () => { observer.kill(); tween.kill(); };
  }, [reduced]);
  return <div className="marquee" aria-label="Torque 620 newton meters, 800 volt architecture, zero emissions, all electric">
    <div className="marquee-track" ref={track} aria-hidden="true"><span>{line}</span><span>{line}</span></div>
  </div>;
}
