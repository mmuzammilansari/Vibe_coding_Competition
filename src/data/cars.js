// Every value, price, specification and booking reference is fictional sample data.
export const CURRENCY = 'NCR'; // NOCTIS Credits: fictional currency, not real money.

export const cars = [
  // One shared 3D model (CarConcept, CC BY 4.0) for all variants. Specs are fictional.
  { id: 's', name: 'NOCTIS S', badge: '01 / PURE', model: '/models/car-concept.glb', poster: '/posters/car-1.webp',
    range: 612, power: 320, acceleration: 4.8, speed: 225, seats: 4, price: 74500,
    torque: '620 Nm', drive: 'DUAL MOTOR', caption: 'The beginning of velocity.' },
  { id: 'gt', name: 'NOCTIS GT', badge: '02 / GRAND TOURING', model: '/models/car-concept.glb', poster: '/posters/car-2.webp',
    range: 565, power: 480, acceleration: 3.4, speed: 260, seats: 4, price: 99800,
    torque: '840 Nm', drive: 'DUAL MOTOR', caption: 'Engineered to go further.' },
  { id: 'r', name: 'NOCTIS R', badge: '03 / TRACK', model: '/models/car-concept.glb', poster: '/posters/car-3.webp',
    range: 490, power: 680, acceleration: 2.6, speed: 310, seats: 2, price: 139000,
    torque: '1,020 Nm', drive: 'TRI MOTOR', caption: 'Every second belongs to you.' },
];

export const paints = [
  { id: 'bone', name: 'Dune Bone', hex: '#C9C3B5', addOn: 0 },
  { id: 'hazard', name: 'Hazard', hex: '#FF4A1C', addOn: 1200 },
  { id: 'graphite', name: 'Graphite', hex: '#505551', addOn: 0 },
  { id: 'oxide', name: 'Oxide Green', hex: '#485448', addOn: 1600 },
  { id: 'ash', name: 'Ash Blue', hex: '#63717A', addOn: 1800 },
  { id: 'ember', name: 'Ember', hex: '#9C4532', addOn: 2200 },
];

export const featureNotes = [
  { id: 'lights', title: 'ADAPTIVE OPTICS', detail: 'Matrix LED system. Fictional 1,400 m beam optimization envelope.', position: [70, 38], at: '0.62 0.66 2.27', normal: '0 0 1' },
  { id: 'wheels', title: 'FORGED AERO', detail: '22-inch aero forged wheel package. Designed for high-speed stability.', position: [33, 70], at: '1.18 0.4 1.54', normal: '1 0 0' },
  { id: 'battery', title: 'STRUCTURAL PACK', detail: 'Low-floor 110 kWh fictional battery architecture.', position: [52, 61], at: '1.09 0.22 0.2', normal: '1 0 0' },
];

export const carById = (id) => cars.find((car) => car.id === id) || cars[0];
export const paintById = (id) => paints.find((paint) => paint.id === id) || paints[2];
export const money = (value) => `${Math.round(value).toLocaleString('en-US')} ${CURRENCY}`;
