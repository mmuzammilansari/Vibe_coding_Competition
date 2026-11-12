import { useEffect, useRef } from 'react';
import { cars, carById, money } from '../data/cars';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import ModelStage from './ModelStage';
import { goToSection } from '../lib/motion';

const rows = [
  ['RANGE / KM', 'range', ' km', 'max'], ['POWER / KW', 'power', ' kW', 'max'],
  ['0—100 / SEC', 'acceleration', ' s', 'min'], ['TOP SPEED', 'speed', ' km/h', 'max'],
  ['SEATS', 'seats', '', 'max'], ['BASE PRICE', 'price', ' NCR', 'min'],
];

export default function Variants() {
  const variant = useStore((s) => s.variant);
  const setVariant = useStore((s) => s.setVariant);
  const paint = useStore((s) => s.paint);
  const compareMode = useStore((s) => s.compareMode);
  const setCompareMode = useStore((s) => s.setCompareMode);
  const compareVariant = useStore((s) => s.compareVariant);
  const setCompareVariant = useStore((s) => s.setCompareVariant);
  const firstViewer = useRef(null);
  const secondViewer = useRef(null);
  const tabs = useRef([]);
  const car = carById(variant);
  const other = carById(compareVariant === variant ? cars.find((item) => item.id !== variant).id : compareVariant);
  useEffect(() => {
    if (compareMode && compareVariant === variant) setCompareVariant(other.id);
  }, [compareMode, compareVariant, variant, setCompareVariant, other.id]);

  useEffect(() => {
    if (!compareMode) return undefined;
    const first = firstViewer.current, second = secondViewer.current;
    if (!first || !second) return undefined;
    const syncFirst = (event) => { if (event.detail?.source === 'user-interaction') second.cameraOrbit = first.cameraOrbit; };
    const syncSecond = (event) => { if (event.detail?.source === 'user-interaction') first.cameraOrbit = second.cameraOrbit; };
    first.addEventListener('camera-change', syncFirst);
    second.addEventListener('camera-change', syncSecond);
    return () => { first.removeEventListener('camera-change', syncFirst); second.removeEventListener('camera-change', syncSecond); };
  }, [compareMode, variant, compareVariant]);

  function onTabKey(event, index) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % cars.length;
    if (event.key === 'ArrowLeft') next = (index + cars.length - 1) % cars.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = cars.length - 1;
    setVariant(cars[next].id);
    tabs.current[next]?.focus();
  }

  return <section id="variants" className="variants section-shell" aria-labelledby="variants-title">
    <div className="section-heading"><span className="eyebrow">02 / THE RANGE</span><span>FOUR EXPRESSIONS OF VELOCITY</span></div>
    <div className="variant-title-row"><h2 id="variants-title">CHOOSE YOUR<br/><em>EXTREME.</em></h2>
      <p>One idea. Four distinct expressions. Find your point of departure.</p></div>
    <div role="tablist" aria-label="Vehicle models" className="variant-tabs">
      {cars.map((item, index) => <button key={item.id} ref={(node) => { tabs.current[index] = node; }}
        role="tab" id={`tab-${item.id}`} type="button" aria-selected={item.id === variant}
        aria-controls="variant-panel" tabIndex={item.id === variant ? 0 : -1}
        onKeyDown={(event) => onTabKey(event, index)} onClick={() => setVariant(item.id)}>
        <span>{item.badge}</span><strong>{item.name}</strong><Icon name="diagonal" size={17} /></button>)}
    </div>
    <div className={`variant-display ${compareMode ? 'is-comparing' : ''}`} id="variant-panel" role="tabpanel" aria-labelledby={`tab-${variant}`} tabIndex="0">
      <div className="variant-main-stage" key={car.id}><ModelStage ref={firstViewer} car={car} paintId={paint} autoRotate={!compareMode}/></div>
      {compareMode && <div className="variant-compare-stage" key={other.id}><ModelStage ref={secondViewer} car={other} paintId={paint} autoRotate={false}/>
        <label className="compare-picker" htmlFor="compare-variant">COMPARE AGAINST
          <select id="compare-variant" value={compareVariant} onChange={(e) => setCompareVariant(e.target.value)}>
            {cars.filter((item) => item.id !== variant).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select></label></div>}
      <div className="variant-caption"><div><span className="eyebrow">CURRENT SELECTION / {car.badge}</span><h3>{car.name}</h3><p>{car.caption}</p></div>
        <div className="variant-price"><span>STARTING AT</span><strong>{money(car.price)}</strong></div></div>
    </div>
    <div className="compare-header"><h3>TECHNICAL COMPARISON</h3>
      <button type="button" className="outline-button" aria-pressed={compareMode} onClick={() => {
        if (!compareMode && compareVariant === variant) setCompareVariant(cars.find((item) => item.id !== variant).id);
        setCompareMode(!compareMode);
      }}>{compareMode ? 'CLOSE SIDE-BY-SIDE' : 'COMPARE SIDE BY SIDE'} <Icon name={compareMode ? 'close' : 'diagonal'} size={17}/></button></div>
    <div className="comparison-scroll" role="region" aria-label="Vehicle comparison table" tabIndex="0">
      <table className="comparison-table"><thead><tr><th scope="col">SPECIFICATION</th>{cars.map((item) => <th scope="col" key={item.id} className={item.id === variant ? 'current' : ''}>{item.name}</th>)}</tr></thead>
        <tbody>{rows.map(([label, key, suffix, direction]) => {
          const best = direction === 'max' ? Math.max(...cars.map((c) => c[key])) : Math.min(...cars.map((c) => c[key]));
          return <tr key={key}><th scope="row">{label}</th>{cars.map((item) => <td key={item.id} className={`${item[key] === best ? 'best-value' : ''} ${item.id === variant ? 'current' : ''}`}>
            {key === 'price' ? money(item[key]) : `${item[key]}${suffix}`}
            <span className={`comparison-meter ${item[key] === best ? 'leading' : ''}`}
              style={{ width: `${Math.max(12, Math.round((direction === 'max' ? item[key] / best : best / item[key]) * 88))}%` }} aria-hidden="true" />
            {item[key] === best && <span className="sr-only">Best in comparison</span>}</td>)}</tr>;
        })}</tbody></table>
    </div>
    <div className="variant-actions"><span className="mono">HIGHLIGHTED VALUES MARK CATEGORY LEADERS</span>
      <button type="button" className="button-primary" onClick={() => goToSection('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={18}/></button></div>
  </section>;
}
