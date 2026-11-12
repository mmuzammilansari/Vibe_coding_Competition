import { useState } from 'react';
import { goToSection } from '../lib/motion';
import { Icon } from './Icons';
import SoundToggle from './SoundToggle';

const links = [['Engineering', 'stats'], ['The range', 'variants'], ['Configure', 'configurator']];
export default function Header({ onPalette }) {
  const [open, setOpen] = useState(false);
  function jump(id) { goToSection(id); setOpen(false); }
  return <header className="site-header" id="top">
    <a className="wordmark" href="#hero" onClick={(event) => { event.preventDefault(); jump('hero'); }} aria-label="NOCTIS, go to top">NØCTIS<span>®</span></a>
    <nav className={`header-nav ${open ? 'open' : ''}`} aria-label="Primary navigation">
      {links.map(([label, id], i) => <a href={`#${id}`} key={id} onClick={(e) => { e.preventDefault(); jump(id); }}><sup>0{i + 1}</sup>{label}</a>)}
      <button className="mobile-test" type="button" onClick={() => jump('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={15} /></button>
    </nav>
    <div className="header-actions">
      <button type="button" className="utility-button palette-trigger" onClick={onPalette} aria-label="Open command palette, Control K"><Icon name="search" size={16}/><span>⌘ K</span></button>
      <SoundToggle />
      <button className="header-cta" type="button" onClick={() => jump('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={15} /></button>
      <button type="button" className="utility-button mobile-menu" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} size={21}/></button>
    </div>
  </header>;
}
