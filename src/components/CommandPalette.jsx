import { useEffect, useMemo, useRef, useState } from 'react';
import { cars, paints } from '../data/cars';
import { useStore } from '../store/useStore';
import { goToSection } from '../lib/motion';
import { Icon } from './Icons';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const setVariant = useStore((s) => s.setVariant);
  const setPaint = useStore((s) => s.setPaint);
  const soundOn = useStore((s) => s.soundOn);
  const setSoundOn = useStore((s) => s.setSoundOn);
  const effectsOff = useStore((s) => s.effectsOff);
  const setEffectsOff = useStore((s) => s.setEffectsOff);

  const commands = useMemo(() => [
    ...[['Overview', 'hero'], ['Engineering', 'stats'], ['Variants', 'variants'], ['Configurator', 'configurator'], ['Test drive', 'test-drive']].map(([label, id]) =>
      ({ title: `Go to ${label}`, category: 'NAVIGATION', action: () => goToSection(id) })),
    ...cars.map((car) => ({ title: `Switch to ${car.name}`, category: 'VEHICLE', action: () => { setVariant(car.id); goToSection('variants'); } })),
    ...paints.map((paint) => ({ title: `Paint: ${paint.name}`, category: 'FINISH', action: () => { setPaint(paint.id); goToSection('configurator'); } })),
    { title: soundOn ? 'Turn sound off' : 'Turn sound on', category: 'PREFERENCES', action: () => setSoundOn(!soundOn) },
    { title: effectsOff ? 'Enable motion effects' : 'Reduce motion effects', category: 'PREFERENCES', action: () => setEffectsOff(!effectsOff) },
    { title: 'Open test-drive form', category: 'ACTION', action: () => goToSection('test-drive') },
  ], [setVariant, setPaint, setSoundOn, setEffectsOff, soundOn, effectsOff]);
  const results = useMemo(() => commands.filter((item) =>
    `${item.title} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())), [commands, query]);

  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const formerFocus = document.activeElement;
    document.body.classList.add('palette-open');
    inputRef.current?.focus();
    function key(event) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', key);
    return () => { document.body.classList.remove('palette-open'); document.removeEventListener('keydown', key); formerFocus?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  function execute(item) { item.action(); onClose(); }
  function navigate(event) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); execute(results[active]); }
  }
  return <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="command-palette" role="dialog" aria-modal="true" aria-labelledby="palette-title" ref={dialogRef}>
      <div className="palette-head"><h2 id="palette-title">QUICK COMMAND</h2><button type="button" aria-label="Close command palette" onClick={onClose}><Icon name="close" size={19}/></button></div>
      <div className="palette-input"><Icon name="search" size={19}/><input ref={inputRef} type="search" role="combobox" aria-label="Search site commands" aria-autocomplete="list"
        aria-controls="palette-options" aria-expanded="true" aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
        value={query} placeholder="SEARCH COMMANDS..." onKeyDown={navigate} onChange={(event) => { setQuery(event.target.value); setActive(0); }} /></div>
      <div className="palette-options" role="listbox" id="palette-options" aria-label="Available commands">
        {results.length ? results.map((item, index) => <button type="button" role="option" aria-selected={active === index}
          id={`cmd-${index}`} key={`${item.category}-${item.title}`} onMouseEnter={() => setActive(index)} onClick={() => execute(item)}>
          <span>{item.title}</span><small>{item.category}</small></button>) : <p className="palette-empty">NO MATCHING COMMANDS</p>}
      </div><p className="palette-hint">↑ ↓ NAVIGATE <span>ENTER SELECT</span> <span>ESC CLOSE</span></p>
    </div>
  </div>;
}
