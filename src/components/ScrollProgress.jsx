import { useEffect, useState } from 'react';
import { goToSection } from '../lib/motion';
const stops = ['hero', 'stats', 'variants', 'configurator', 'test-drive'];
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState('hero');
  useEffect(() => {
    let frame = null;
    function update() {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0);
        let current = 'hero';
        stops.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight * .46) current = id; });
        setSection(current); frame = null;
      });
    }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); if (frame !== null) cancelAnimationFrame(frame); };
  }, []);
  return <nav className="scroll-progress" aria-label="Section progress">
    <div className="progress-rail" aria-hidden="true"><span style={{ height: `${progress}%` }}/></div>
    {stops.map((id, index) => <button type="button" key={id} onClick={() => goToSection(id)}
      className={section === id ? 'current' : ''} aria-current={section === id ? 'location' : undefined} aria-label={`Go to section ${index + 1}: ${id.replace('-', ' ')}`}><span>0{index + 1}</span></button>)}
  </nav>;
}
