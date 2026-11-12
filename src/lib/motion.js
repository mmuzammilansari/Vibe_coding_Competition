import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP); // Registered once, not per component.

let activeLenis = null;
export const setActiveLenis = (instance) => { activeLenis = instance; };
export function goToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  if (activeLenis) activeLenis.scrollTo(element, { offset: -72, duration: 1.1 });
  else element.scrollIntoView({ behavior: 'auto', block: 'start' });
}
export { gsap, ScrollTrigger, useGSAP };
