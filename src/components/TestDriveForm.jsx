import { useState } from 'react';
import { cars, carById, paintById } from '../data/cars';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

function localISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
const initial = { name: '', email: '', date: '', city: '' };
function getErrors(fields, selectedVariant) {
  const errors = {};
  if (!fields.name.trim() || fields.name.trim().length < 2) errors.name = 'Enter a demo name with at least two characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Enter a valid demo email address.';
  if (!cars.some((car) => car.id === selectedVariant)) errors.variant = 'Choose a model.';
  if (!fields.date || fields.date < localISODate()) errors.date = 'Choose today or a future date.';
  if (!fields.city) errors.city = 'Choose a city.';
  return errors;
}

export default function TestDriveForm() {
  const storeVariant = useStore((s) => s.variant);
  const paint = useStore((s) => s.paint);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);
  const variant = selectedVariant ?? storeVariant;
  const setField = (key, value) => { setFields((old) => ({ ...old, [key]: value })); setErrors((old) => ({ ...old, [key]: undefined })); };

  function submit(event) {
    event.preventDefault();
    const failures = getErrors(fields, variant);
    setErrors(failures);
    const firstError = Object.keys(failures)[0];
    if (firstError) { document.getElementById(`field-${firstError}`)?.focus(); return; }
    // No network request, database write, localStorage, or analytics call.
    setTicket({ reference: `NC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      variant: carById(variant).name, paint: paintById(paint).name, date: fields.date, city: fields.city });
  }
  function reset() { setTicket(null); setFields(initial); setErrors({}); setSelectedVariant(null); }
  return <section id="test-drive" className="test-drive section-shell" aria-labelledby="drive-title">
    <div className="section-heading"><span className="eyebrow">04 / EXPERIENCE</span><span>THE NEXT MOVE IS YOURS</span></div>
    <div className="test-layout"><div className="test-intro"><h2 id="drive-title">FEEL<br/>THE <em>FUTURE.</em></h2>
      <p>Nothing replaces the driver's seat. Request a fictional demonstration of the NOCTIS experience.</p>
      <div className="test-big-number" aria-hidden="true">04<span>/04</span></div>
      <span className="eyebrow">NOCTIS / PROTOTYPE BOOKING SYSTEM</span></div>
      <div className="test-panel">{ticket ? <div className="ticket" role="status" aria-live="polite">
        <span className="eyebrow">BOOKING SIMULATION / COMPLETE</span><Icon name="check" size={34}/>
        <h3>YOU'RE ON<br/>THE LIST.</h3><p>Fictional booking confirmed in this browser session only. Nothing was sent or saved.</p>
        <div className="ticket-row"><span>REFERENCE</span><strong>{ticket.reference}</strong></div>
        <div className="ticket-row"><span>VEHICLE</span><strong>{ticket.variant}</strong></div>
        <div className="ticket-row"><span>FINISH</span><strong>{ticket.paint}</strong></div>
        <div className="ticket-row"><span>DATE</span><strong>{ticket.date}</strong></div>
        <div className="ticket-row"><span>CITY</span><strong>{ticket.city}</strong></div>
        <button type="button" className="button-primary full-width" onClick={reset}>BOOK ANOTHER <Icon name="reset" size={18}/></button>
      </div> : <form onSubmit={submit} noValidate>
        <div className="form-heading"><h3>REQUEST A DRIVE</h3><span className="eyebrow">SAMPLE DATA / FICTIONAL ONLY</span></div>
        <p className="form-warning">Prototype only. Nothing is sent or stored. Use invented names and emails, not real personal information.</p>
        <div className="form-grid">
          <div className="field"><label htmlFor="field-name">DEMO NAME <span aria-hidden="true">*</span></label>
            <input id="field-name" name="demo-name" required autoComplete="off" placeholder="Alex Example" value={fields.name}
              aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'error-name' : undefined} onChange={(e) => setField('name', e.target.value)}/>
            <span className="field-error" id="error-name" aria-live="polite">{errors.name}</span></div>
          <div className="field"><label htmlFor="field-email">DEMO EMAIL <span aria-hidden="true">*</span></label>
            <input id="field-email" name="demo-email" type="email" required autoComplete="off" placeholder="alex@example.test" value={fields.email}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} onChange={(e) => setField('email', e.target.value)}/>
            <span className="field-error" id="error-email" aria-live="polite">{errors.email}</span></div>
          <div className="field"><label htmlFor="field-variant">MODEL <span aria-hidden="true">*</span></label>
            <select id="field-variant" name="variant" required value={variant} onChange={(e) => { setSelectedVariant(e.target.value); setErrors((old) => ({ ...old, variant: undefined })); }}
              aria-invalid={Boolean(errors.variant)}>{cars.map((car) => <option key={car.id} value={car.id}>{car.name}</option>)}</select>
            <span className="field-error" id="error-variant" aria-live="polite">{errors.variant}</span></div>
          <div className="field"><label htmlFor="field-date">PREFERRED DATE <span aria-hidden="true">*</span></label>
            <input id="field-date" name="date" type="date" min={localISODate()} value={fields.date} required
              aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'error-date' : undefined} onChange={(e) => setField('date', e.target.value)}/>
            <span className="field-error" id="error-date" aria-live="polite">{errors.date}</span></div>
          <div className="field span-2"><label htmlFor="field-city">DEMO CITY <span aria-hidden="true">*</span></label>
            <select id="field-city" name="city" required value={fields.city} onChange={(e) => setField('city', e.target.value)} aria-invalid={Boolean(errors.city)}>
              <option value="">SELECT A CITY</option><option value="Karachi">Karachi</option><option value="Doha">Doha</option><option value="Dubai">Dubai</option><option value="London">London</option>
            </select><span className="field-error" id="error-city" aria-live="polite">{errors.city}</span></div>
        </div>
        <button className="button-primary full-width" type="submit">SIMULATE BOOKING <Icon name="diagonal" size={18}/></button>
        <p className="form-bottom-note">*REQUIRED FIELDS / NO NETWORK REQUEST / NO REAL RESERVATION</p>
      </form>}</div></div>
  </section>;
}
