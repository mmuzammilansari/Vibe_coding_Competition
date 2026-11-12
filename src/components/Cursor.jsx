import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
export default function Cursor({ reduced, touch }) {
  const circle = useRef(null);
  useEffect(() => {
    if (reduced || touch || !circle.current) return undefined;
    const element = circle.current;
    const toX = gsap.quickTo(element, 'x', { duration: 0.16, ease: 'power3.out' });
    const toY = gsap.quickTo(element, 'y', { duration: 0.16, ease: 'power3.out' });
    const move = (event) => {
      toX(event.clientX); toY(event.clientY);
      const under = event.target;
      const drag = Boolean(under?.closest?.('model-viewer, .model-stage'));
      const interactive = Boolean(under?.closest?.('button, a, input, select'));
      element.classList.toggle('drag', drag);
      element.classList.toggle('hovered', interactive);
      element.textContent = drag ? 'DRAG' : '';
      element.style.opacity = '1';
    };
    const hide = () => { element.style.opacity = '0'; };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', hide);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); };
  }, [reduced, touch]);
  if (reduced || touch) return null;
  return <div ref={circle} className="cursor-ring" aria-hidden="true"/>;
}
