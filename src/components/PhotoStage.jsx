import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useStore } from '../store/useStore';

/**
 * A cinematic 2D reference photo stage. Animations are image transitions,
 * NOT model rotation. A matching GLB is required for interactive 3D.
 */
export default function PhotoStage({ car, environment = 'studio', className = '', eager = false }) {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const loaderDone = useStore((s) => s.loaderDone);
  const shouldStart = !eager || loaderDone;

  useGSAP(() => {
    if (!shouldStart || !scope.current) return;
    const image = scope.current.querySelector('.reference-car-photo');
    const title = scope.current.querySelector('.reference-car-badge');
    const scan = scope.current.querySelector('.photo-scan');
    if (!image) return;
    if (reduced) {
      gsap.set([image, title, scan].filter(Boolean), { clearProps: 'all' });
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      ...(!eager ? { scrollTrigger: { trigger: scope.current, start: 'top 93%', once: true } } : {}),
    });
    tl.fromTo(image,
      { autoAlpha: 0, xPercent: 7, scale: 1.1, filter: 'brightness(.68)' },
      { autoAlpha: 1, xPercent: 0, scale: 1, filter: 'brightness(1)', duration: 1.25, clearProps: 'filter' }, 0)
      .fromTo(title, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: .65 }, .28)
      .fromTo(scan, { xPercent: -120, autoAlpha: .9 }, { xPercent: 160, autoAlpha: 0, duration: 1.25, ease: 'power2.inOut' }, .10);
    // Editorial depth: a small scroll-linked vertical drift, not fake 3D rotation.
    gsap.fromTo(image, { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: .9 },
    });
    // Desktop pointer parallax is deliberately subtle and does not pretend
    // to offer 360-degree movement from a single photographic reference.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const moveX = gsap.quickTo(image, 'x', { duration: .65, ease: 'power2.out' });
      const moveY = gsap.quickTo(image, 'y', { duration: .65, ease: 'power2.out' });
      const onMove = (event) => {
        const rect = scope.current.getBoundingClientRect();
        moveX(((event.clientX - rect.left) / rect.width - .5) * 24);
        moveY(((event.clientY - rect.top) / rect.height - .5) * 12);
      };
      const onLeave = () => { moveX(0); moveY(0); };
      scope.current.addEventListener('pointermove', onMove);
      scope.current.addEventListener('pointerleave', onLeave);
      return () => {
        scope.current?.removeEventListener('pointermove', onMove);
        scope.current?.removeEventListener('pointerleave', onLeave);
        moveX.tween?.kill(); moveY.tween?.kill();
      };
    }
  }, { scope, dependencies: [car.id, reduced, shouldStart, eager], revertOnUpdate: true });

  return <div ref={scope} className={`model-stage reference-image-stage ${environment === 'night' ? 'model-night' : ''} ${className}`}>
    <div className="photo-grid" aria-hidden="true" />
    <div className="photo-accent" aria-hidden="true" />
    <div className="photo-scan" aria-hidden="true" />
    <img className="reference-car-photo" src={car.poster}
      alt={`${car.name} static concept photograph (not a 3D model)`}
      loading={eager ? 'eager' : 'lazy'} decoding="async" />
    <div className="viewfinder" aria-hidden="true"><i/><i/><i/><i/></div>
    <span className="reference-car-badge">VISUAL CONCEPT / 02D</span>
    <div className="stage-footer"><span>FIG / {car.id.toUpperCase()} — DIGITAL CONCEPT</span><span>STATIC PHOTO</span></div>
  </div>;
}
