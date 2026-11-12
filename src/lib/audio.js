// Sound is optional, off by default, synthesized locally and starts only after user action.
let context;
let engine;
let engineGain;
export function clickSound() {
  if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === 'suspended') void context.resume();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(410, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(180, context.currentTime + 0.07);
  gain.gain.setValueAtTime(0.018, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(); oscillator.stop(context.currentTime + 0.09);
}
export function setEngineSound(on) {
  if (!on) {
    if (engine) { engine.stop(); engine.disconnect(); engine = null; }
    if (engineGain) { engineGain.disconnect(); engineGain = null; }
    return;
  }
  if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === 'suspended') void context.resume();
  if (engine) return;
  engine = context.createOscillator();
  engineGain = context.createGain();
  engine.type = 'sawtooth'; engine.frequency.value = 44;
  engineGain.gain.value = 0.004;
  engine.connect(engineGain).connect(context.destination);
  engine.start();
}
