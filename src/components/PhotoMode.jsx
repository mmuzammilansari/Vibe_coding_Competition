import { useState } from 'react';
import { Icon } from './Icons';
export default function PhotoMode({ viewerRef, car }) {
  const [message, setMessage] = useState('');
  async function save() {
    try {
      const viewer = viewerRef.current;
      if (!car.model) {
        const link = document.createElement('a');
        link.href = car.poster;
        link.download = `noctis-${car.id}-concept.webp`;
        document.body.appendChild(link); link.click(); link.remove();
        setMessage('CONCEPT IMAGE SAVED');
        return;
      }
      if (!viewer?.model || !viewer.toBlob) throw new Error('Wait until the 3D model has loaded.');
      const blob = await viewer.toBlob({ mimeType: 'image/png', idealAspect: true });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `noctis-${car.id}-studio.png`;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('PNG IMAGE SAVED');
    } catch (error) { setMessage(error.message || 'Could not capture this view.'); }
  }
  return <div className="photo-controls"><button type="button" className="outline-button" onClick={save}><Icon name="camera" size={17} /> {car.model ? 'PHOTO MODE / SAVE PNG' : 'SAVE CONCEPT IMAGE'}</button>
    <span role="status" aria-live="polite">{message}</span></div>;
}
