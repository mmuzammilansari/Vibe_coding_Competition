import { useCallback, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from './lib/motion';
import SplitType from 'split-type';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsTouch } from './hooks/useIsTouch';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Variants from './components/Variants';
import Configurator from './components/Configurator';
import TestDriveForm from './components/TestDriveForm';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';

export default function App() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const loaded = useStore((s) => s.loaderDone);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  useLenis(reduced);
  useEffect(() => { document.body.classList.toggle('effects-off', reduced);
    return () => document.body.classList.remove('effects-off'); }, [reduced]);
  useEffect(() => {
    function shortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setPaletteOpen((value) => !value);
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (!loaded || reduced) return undefined;
    const sections = document.querySelectorAll('.section-shell');
    const cleanupSplits = [];
    const context = gsap.context(() => {
      sections.forEach((section) => {
        const heading = section.querySelector('h2');
        if (!heading) return;
        const split = new SplitType(heading, { types: 'lines' });
        gsap.from(split.lines, { yPercent: 85, opacity: 0, duration: .85, stagger: .1, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 90%', once: true } });
        // SplitType's DOM changes must be restored on effect cleanup.
        cleanupSplits.push(split);
      });
      gsap.to('.hero-title', { yPercent: 12, ease: 'none', scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
      } });
      gsap.to('.footer-mark', { xPercent: -7, ease: 'none', scrollTrigger: {
        trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true,
      } });
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => { context.revert(); cleanupSplits.forEach((split) => split.revert()); window.clearTimeout(refresh); };
  }, [loaded, reduced]);
  return <>
    <a className="skip-link" href="#main">SKIP TO CONTENT</a>
    <Loader reduced={reduced}/>
    <Header onPalette={() => setPaletteOpen(true)}/>
    <main id="main">
      <Hero reduced={reduced}/>
      <div className="intro-strip"><span>FOUR VEHICLES</span><span>ONE PHILOSOPHY</span><span>EVERY LIMIT RECONSIDERED</span></div>
      <Stats reduced={reduced} touch={touch}/>
      <Variants/>
      <Configurator/>
      <TestDriveForm/>
    </main>
    <Footer/>
    <ScrollProgress/>
    <Cursor reduced={reduced} touch={touch}/>
    <CommandPalette open={paletteOpen} onClose={closePalette}/>
    <svg className="grain-filter" aria-hidden="true"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" stitchTiles="stitch"/></filter></svg>
    <div className="grain-layer" aria-hidden="true"/>
  </>;
}
