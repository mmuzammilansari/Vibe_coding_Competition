import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion';
import { useStore } from '../store/useStore';
import { carById } from '../data/cars';
import ModelStage from './ModelStage';

export default function Stats({ reduced, touch }) {
  const scope = useRef(null);
  const viewer = useRef(null);
  const car = useStore((s) => carById(s.variant));
  const paint = useStore((s) => s.paint);
  const metrics = [
    ['0—100 KM/H', car.acceleration, 'S', 1], ['RANGE / WLTP*', car.range, 'KM', 0],
    ['PEAK OUTPUT', car.power, 'KW', 0], ['TOP SPEED', car.speed, 'KM/H', 0],
  ];
  useGSAP(() => {
    if (reduced) return;
    const numbers = scope.current.querySelectorAll('[data-stat]');
    numbers.forEach((node) => {
      const value = Number(node.dataset.stat);
      const digits = Number(node.dataset.decimals);
      const state = { n: 0 };
      gsap.to(state, { n: value, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        onUpdate: () => { node.textContent = state.n.toFixed(digits); } });
    });
    gsap.from('.stat-annotation path', { strokeDasharray: 220, strokeDashoffset: 220, duration: 1.2, scrollTrigger: { trigger: '.stats', start: 'top 60%', once: true } });
    // Only pin on genuinely desktop-sized pointer devices. Responsive resizing is handled automatically.
    const media = gsap.matchMedia();
    media.add('(min-width: 1025px) and (hover: hover) and (pointer: fine)', () => {
      if (touch) return;
      const proxy = { angle: 35 };
      gsap.to(proxy, { angle: 160, ease: 'none', scrollTrigger: { trigger: scope.current, start: 'top top', end: '+=100%', scrub: true, pin: true, anticipatePin: 1 },
        onUpdate: () => { const element = viewer.current; if (element) element.cameraOrbit = `${proxy.angle}deg 77deg 10m`; } });
    });
    return () => media.revert();
  }, { scope, dependencies: [reduced, touch, car.id], revertOnUpdate: true });
  return <section id="stats" className="stats section-shell" aria-labelledby="stats-title" ref={scope}>
    <div className="section-heading"><span className="eyebrow">01 / ENGINEERING</span><span>CONTROL WITHOUT COMPROMISE</span></div>
    <div className="stats-layout">
      <div className="stats-intro"><h2 id="stats-title">BUILT TO<br/><em>MOVE.</em></h2><p>Every number earned. Every surface intentional. Performance measured by what it makes possible.</p>
        <svg className="stat-annotation" viewBox="0 0 220 80" fill="none" aria-hidden="true"><path d="M0 2h82l36 36h102" stroke="currentColor" strokeWidth="1" /></svg>
      </div>
      <div className="stats-vehicle"><ModelStage key={car.id} ref={viewer} car={car} paintId={paint} autoRotate={false} cameraOrbit="35deg 77deg 10m" /></div>
      <div className="stats-grid">{metrics.map(([label, number, unit, digits], index) => <div className="stat" key={label}>
        <div className="stat-top"><span>0{index + 1}</span><span>{label}</span></div>
        <strong><span data-stat={number} data-decimals={digits}>{number.toFixed(digits)}</span><small>{unit}</small></strong>
      </div>)}</div>
    </div><p className="stats-disclaimer">*ALL SPECIFICATIONS ARE FICTIONAL SAMPLE DATA.</p>
  </section>;
}
