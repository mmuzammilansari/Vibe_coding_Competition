import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { paintById, featureNotes } from '../data/cars';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Icon } from './Icons';
import PhotoStage from './PhotoStage';

// Add real GLB files only when they match these four reference vehicles.
// In DevTools after load: document.querySelector('model-viewer').model.materials.map(m => m.name)
// Rename the car body material to Body_Paint in Blender, or change this constant.
const PAINT_MATERIAL_NAME = 'Paint 1 Carmine'; // body paint material inside car-concept.glb

function VehicleSilhouette({ label }) {
  return <svg className="vehicle-silhouette" viewBox="0 0 1000 440" role="img" aria-label={label}>
    <defs>
      <linearGradient id="silhouetteBody" x1="0" x2="0" y1="0" y2="1">
        <stop stopColor="#898D82" /><stop offset=".58" stopColor="#373C37" /><stop offset="1" stopColor="#111410" />
      </linearGradient>
    </defs>
    <ellipse cx="500" cy="346" rx="395" ry="28" fill="#000" opacity=".4" />
    <path d="M103 278 174 245 272 225 356 150Q382 131 431 129h165q56 3 95 38l78 61 90 17q48 11 54 46l3 42H87l-1-32z" fill="url(#silhouetteBody)" stroke="#AAB0A6" strokeWidth="2" />
    <path d="m364 164-58 61 409 2-63-60q-23-18-58-19H425q-35 0-61 16" fill="#101711" stroke="#88918D" strokeWidth="2" />
    <path d="m523 149-3 78M300 237l-50 38M730 236l65 24" stroke="#626D65" strokeWidth="3" />
    <path d="M96 290h117M802 279h110" stroke="#19D8FF" strokeWidth="5" />
    <circle cx="263" cy="318" r="67" fill="#080909" stroke="#5F6661" strokeWidth="10" />
    <circle cx="745" cy="318" r="67" fill="#080909" stroke="#5F6661" strokeWidth="10" />
    {[263, 745].map((cx) => <g key={cx} transform={`translate(${cx} 318)`}>
      <circle r="42" fill="#262A27" stroke="#7A8078" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((rotation) =>
        <path key={rotation} transform={`rotate(${rotation})`} d="M-5-10-10-32 0-39 10-32 5-10" fill="#8A8F85" />)}
      <circle r="12" fill="#161A18" stroke="#959B8F" strokeWidth="2" />
    </g>)}
    <path d="M124 288h68m626-4h70" stroke="#F2D6C3" strokeWidth="3" />
  </svg>;
}

const ModelStage = forwardRef(function ModelStage({ car, paintId, environment = 'studio',
  className = '', autoRotate = true, cameraOrbit = '35deg 76deg 10m',
  interaction = true, eager = false, hotspots = false, onReady, onFailure }, forwardedRef) {
  const reduced = useReducedMotion();
  const modelRef = useRef(null);
  const [state, setState] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [paintApplied, setPaintApplied] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const [note, setNote] = useState(null);
  useImperativeHandle(forwardedRef, () => modelRef.current);

  useEffect(() => { setState('loading'); setProgress(0); setPaintApplied(true); }, [car.model]);
  useEffect(() => {
    const element = modelRef.current;
    if (!element) return undefined;
    function handleLoad() { setState('ready'); setArSupported(Boolean(element.canActivateAR)); onReady?.(element); }
    function handleProgress(event) { setProgress(Math.round((event.detail?.totalProgress || 0) * 100)); }
    function handleError() { setState('error'); onFailure?.(); }
    element.addEventListener('load', handleLoad);
    element.addEventListener('progress', handleProgress);
    element.addEventListener('error', handleError);
    return () => {
      element.removeEventListener('load', handleLoad);
      element.removeEventListener('progress', handleProgress);
      element.removeEventListener('error', handleError);
    };
  }, [car.model, onFailure, onReady]);

  useEffect(() => {
    if (state !== 'ready') return;
    const element = modelRef.current;
    const materials = element?.model?.materials || [];
    const bodies = materials.filter((m) => m.name === PAINT_MATERIAL_NAME)
      .concat(materials.filter((m) => m.name !== PAINT_MATERIAL_NAME && /body.*paint|paint.*body|paintwork|carpaint/i.test(m.name)));
    if (!bodies.length) { setPaintApplied(false); return; }
    bodies.forEach((body) => body.pbrMetallicRoughness.setBaseColorFactor(paintById(paintId).hex));
    setPaintApplied(true);
  }, [paintId, state, car.model]);

  // This project currently ships four concept photos, not matching GLB meshes.
  // PhotoStage provides cinematic 2D motion and explicitly avoids fake rotation.
  if (!car.model) return <PhotoStage car={car} environment={environment} className={className} eager={eager} />;

  return <div className={`model-stage ${environment === 'night' ? 'model-night' : ''} ${className}`}>
    <div className="viewfinder" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="stage-grid" aria-hidden="true" />
    <model-viewer
      ref={modelRef}
      src={car.model}
      alt={`Interactive 3D ${car.name} electric performance vehicle; drag to rotate and scroll to zoom`}
      aria-label={`Interactive 3D ${car.name} vehicle`}
      camera-controls={interaction ? '' : undefined}
      auto-rotate={autoRotate && !reduced ? '' : undefined}
      ar="" ar-modes="webxr scene-viewer quick-look"
      loading={eager ? 'eager' : 'lazy'}
      reveal="auto"
      camera-orbit={cameraOrbit}
      min-camera-orbit="auto 45deg auto"
      max-camera-orbit="auto 92deg auto"
      field-of-view="30deg"
      environment-image={environment === 'night' ? 'legacy' : 'neutral'}
      exposure={environment === 'night' ? '0.65' : '1.12'}
      shadow-intensity="0.85"
      shadow-softness="0.9"
      interaction-prompt="none"
      touch-action="pan-y"
    >
      {hotspots && featureNotes.map((f, i) => <button key={f.id} type="button" slot={`hotspot-${f.id}`} className="mv-hotspot"
        data-position={f.at} data-normal={f.normal} data-visibility-attribute="visible" aria-label={`Feature ${i + 1}: ${f.title}`}
        onClick={() => setNote(note?.id === f.id ? null : f)}>{i + 1}</button>)}
    </model-viewer>
    {note && <aside className="hotspot-note" aria-live="polite"><div><span className="eyebrow">SYSTEM / FEATURE</span>
      <button type="button" aria-label="Close feature details" onClick={() => setNote(null)}><Icon name="close" size={16}/></button></div>
      <h4>{note.title}</h4><p>{note.detail}</p></aside>}
    {state !== 'ready' && <div className="model-placeholder" aria-live={state === 'error' ? 'polite' : 'off'}>
      <VehicleSilhouette label={`${car.name} stylized vehicle placeholder illustration`} />
      {state === 'loading' ? <div className="model-load"><span>MODEL / INITIALIZING</span><span>{String(progress).padStart(3, '0')}%</span>
        <div className="model-load-bar"><span style={{ width: `${progress}%` }} /></div></div>
        : <p className="model-error">3D ASSET NOT INSTALLED — ADD {car.model.replace('/models/', '')} TO /PUBLIC/MODELS</p>}
    </div>}
    {state === 'ready' && !paintApplied && <span className="paint-warning" role="status">Body material not found. Rename it “Body_Paint” to enable color changes.</span>}
    <div className="stage-footer"><span>FIG / {car.id.toUpperCase()} — DIGITAL PROTOTYPE</span><span>{state === 'ready' ? 'DRAG TO ROTATE' : 'MODEL PREVIEW'}</span></div>
    {arSupported && state === 'ready' && <button type="button" className="stage-ar" onClick={() => modelRef.current?.activateAR()}>VIEW IN YOUR SPACE <Icon name="diagonal" size={15}/></button>}
  </div>;
});
export default ModelStage;
