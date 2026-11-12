import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap, useGSAP } from '../lib/motion';
import { carById } from '../data/cars';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import Marquee from './Marquee';
import ModelStage from './ModelStage';
import { goToSection } from '../lib/motion';

export default function Hero({ reduced }) {
  const scope = useRef(null);
  const stage = useRef(null);
  const introContext = useRef(null);
  useEffect(() => () => introContext.current?.revert(), []);
  const loaded = useStore((s) => s.loaderDone);
  const car = useStore((s) => carById(s.variant));
  const paint = useStore((s) => s.paint);
  const environment = useStore((s) => s.environment);
  useGSAP(() => {
    // Loader is a full-screen overlay; start the hero reveal only after it exits.
    if (reduced || !loaded) return;
    const title = scope.current.querySelector('.hero-title');
    const split = new SplitType(title, { types: 'chars' });
    gsap.from(split.chars, { yPercent: 105, opacity: 0, stagger: 0.035, duration: 0.9, delay: 0.12, ease: 'power3.out' });
    gsap.from('.hero-aside > *', { x: -20, opacity: 0, stagger: 0.13, duration: 0.8, delay: 0.4 });
    const magnetic = scope.current.querySelector('.magnetic');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && magnetic) {
      const move = (event) => {
        const rect = magnetic.getBoundingClientRect();
        gsap.to(magnetic, { x: (event.clientX - rect.left - rect.width / 2) * .09,
          y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .25, overwrite: true });
      };
      const leave = () => gsap.to(magnetic, { x: 0, y: 0, duration: .4, ease: 'power2.out' });
      magnetic.addEventListener('pointermove', move);
      magnetic.addEventListener('pointerleave', leave);
      return () => { magnetic.removeEventListener('pointermove', move); magnetic.removeEventListener('pointerleave', leave); split.revert(); };
    }
    return () => split.revert();
  }, { scope, dependencies: [reduced, loaded], revertOnUpdate: true });

  const ready = (element) => {
    if (reduced) return;
    element.cameraOrbit = '10deg 78deg 12m';
    const orbit = { angle: 10, dist: 12 };
    introContext.current?.revert();
    introContext.current = gsap.context(() => {
      gsap.to(orbit, { angle: 35, dist: 10, duration: 1.8, ease: 'power2.inOut',
        onUpdate: () => { if (element.isConnected) element.cameraOrbit = `${orbit.angle}deg 76deg ${orbit.dist}m`; } });
    }, stage);
  };

  return <section id="hero" className="hero" aria-labelledby="hero-title" ref={scope}>
    <div className="hero-meta"><span>ALL ELECTRIC / 01—04</span><span>DESIGNED FOR WHAT'S NEXT</span></div>
    <h1 className="hero-title" id="hero-title" aria-label="NOCTIS">NOCTIS</h1>
    <div className="hero-viewer" ref={stage}><ModelStage key={car.id} car={car} paintId={paint} environment={environment} onReady={ready} eager /></div>
    <div className="hero-aside">
      <span className="eyebrow">THE FORM OF FORWARD</span>
      <h2>{car.acceleration.toFixed(1)}<small>SEC</small></h2>
      <p>0—100 KM/H.<br />NO DELAY. NO DETOUR.</p>
      <button className="button-primary magnetic" type="button" onClick={() => goToSection('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={19} /></button>
      <button className="text-link" type="button" onClick={() => goToSection('variants')}>COMPARE THE RANGE <Icon name="arrow" size={17} /></button>
    </div>
    <div className="hero-facts" aria-label={`${car.name} three performance highlights`}>
      <div><span>RANGE</span><strong>{car.range}<small> KM</small></strong></div>
      <div><span>PEAK POWER</span><strong>{car.power}<small> KW</small></strong></div>
      <div><span>TOP SPEED</span><strong>{car.speed}<small> KM/H</small></strong></div>
    </div>
    <div className="hero-side-label" aria-hidden="true">ENGINEERED IN THE DARK / VOL. 01</div>
    <div className="hero-bottom"><span>01 / THE MACHINE</span><span>{car.model ? 'DRAG TO EXPLORE' : 'SCROLL TO EXPLORE THE CONCEPTS'} <span className="down-arrow">↓</span></span></div>
    <Marquee reduced={reduced} />
  </section>;
}
