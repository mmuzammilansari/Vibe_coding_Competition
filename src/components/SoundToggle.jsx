import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { clickSound, setEngineSound } from '../lib/audio';
import { Icon } from './Icons';

export default function SoundToggle() {
  const soundOn = useStore((s) => s.soundOn);
  const setSoundOn = useStore((s) => s.setSoundOn);
  useEffect(() => {
    setEngineSound(soundOn);
    return () => setEngineSound(false);
  }, [soundOn]);
  function toggle() {
    if (!soundOn) clickSound();
    setSoundOn(!soundOn);
  }
  return <button type="button" className="utility-button" onClick={toggle}
    aria-label={`Turn sound ${soundOn ? 'off' : 'on'}`} aria-pressed={soundOn}>
    <Icon name={soundOn ? 'sound' : 'mute'} size={17} /> <span className="utility-label">SOUND {soundOn ? 'ON' : 'OFF'}</span>
  </button>;
}
