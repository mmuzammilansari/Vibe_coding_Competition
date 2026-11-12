import { useState } from 'react';
import { featureNotes } from '../data/cars';
import { Icon } from './Icons';

export default function Hotspots() {
  const [selected, setSelected] = useState(null);
  return <div className="hotspots" aria-label="Vehicle feature annotations">
    {featureNotes.map((feature, index) => <div key={feature.id} className="hotspot" style={{ left: `${feature.position[0]}%`, top: `${feature.position[1]}%` }}>
      <button type="button" aria-expanded={selected === feature.id} aria-controls={`feature-${feature.id}`}
        aria-label={`Feature ${index + 1}: ${feature.title}`} onClick={() => setSelected(selected === feature.id ? null : feature.id)}>{index + 1}</button>
    </div>)}
    {selected && <aside className="hotspot-note" id={`feature-${selected}`} aria-live="polite">
      <div><span className="eyebrow">SYSTEM / FEATURE 0{featureNotes.findIndex((f) => f.id === selected) + 1}</span>
        <button type="button" aria-label="Close feature details" onClick={() => setSelected(null)}><Icon name="close" size={16}/></button></div>
      <h4>{featureNotes.find((f) => f.id === selected).title}</h4><p>{featureNotes.find((f) => f.id === selected).detail}</p>
    </aside>}
  </div>;
}
