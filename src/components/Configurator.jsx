import { useRef } from 'react';
import { carById, money, paints, paintById } from '../data/cars';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import ModelStage from './ModelStage';
import Hotspots from './Hotspots';
import PhotoMode from './PhotoMode';
import { goToSection } from '../lib/motion';

export default function Configurator() {
  const viewerRef = useRef(null);
  const variant = useStore((s) => s.variant);
  const paint = useStore((s) => s.paint);
  const setPaint = useStore((s) => s.setPaint);
  const environment = useStore((s) => s.environment);
  const setEnvironment = useStore((s) => s.setEnvironment);
  const car = carById(variant);
  const selected = paintById(paint);
  return <section className="configurator section-shell" id="configurator" aria-labelledby="config-title">
    <div className="section-heading"><span className="eyebrow">03 / CONFIGURATION</span><span>MAKE IT YOUR OWN</span></div>
    <div className="config-layout"><div className="config-heading"><h2 id="config-title">SPECIFIED<br/><em>BY YOU.</em></h2><p>The details are never small. Six finishes, one clear statement.</p>
      <span className="eyebrow">SELECTED MACHINE</span><strong>{car.name}</strong>
      <div className="config-environment"><span className="eyebrow">LIGHTING / ENVIRONMENT</span>
        <div role="group" aria-label="Lighting environment"><button type="button" aria-pressed={environment === 'studio'} onClick={() => setEnvironment('studio')}>STUDIO</button>
          <button type="button" aria-pressed={environment === 'night'} onClick={() => setEnvironment('night')}>NIGHT</button></div></div>
    </div>
    <div className="config-stage"><ModelStage ref={viewerRef} car={car} paintId={paint} environment={environment} hotspots />{!car.model && <Hotspots />}</div>
    <div className="config-panel"><span className="eyebrow">FINISH / EXTERIOR PAINT</span><h3>{selected.name}</h3>
      <div className="paint-swatches" role="group" aria-label="Select body paint">
        {paints.map((item) => <button key={item.id} type="button" className={item.id === paint ? 'selected' : ''}
          onClick={() => setPaint(item.id)} style={{ '--swatch-color': item.hex }}
          aria-label={`${item.name}, ${item.addOn ? money(item.addOn) : 'included'}`} aria-pressed={item.id === paint}><span /></button>)}
      </div>
      {!car.model && <p className="concept-2d-notice">PAINT PREVIEW REQUIRES A MATCHING 3D MODEL. PRICES ARE SAMPLE DATA.</p>}
      <div className="paint-breakdown"><div><span>BASE VEHICLE</span><strong>{money(car.price)}</strong></div>
        <div><span>EXTERIOR FINISH</span><strong>{selected.addOn ? `+ ${money(selected.addOn)}` : 'INCLUDED'}</strong></div>
        <div className="total"><span>YOUR CONFIGURATION</span><strong>{money(car.price + selected.addOn)}</strong></div></div>
      <PhotoMode viewerRef={viewerRef} car={car} />
      <button type="button" className="button-primary full-width" onClick={() => goToSection('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={18}/></button>
      <small>FICTIONAL PRICES. NO TRANSACTION TAKES PLACE.</small>
    </div></div>
  </section>;
}
