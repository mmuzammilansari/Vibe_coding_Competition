import React from 'react';
export function Icon({ name, size = 18, ...props }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, ...props };
  const paths = {
    arrow: <><path d="M4 12h16M13 5l7 7-7 7" /></>,
    diagonal: <><path d="M5 19 19 5M7 5h12v12" /></>,
    sound: <><path d="M4 9v6h4l5 4V5L8 9H4zM16 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
    mute: <><path d="M4 9v6h4l5 4V5L8 9H4zM17 9l5 6m0-6-5 6" /></>,
    close: <><path d="M5 5l14 14M19 5 5 19" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    camera: <><path d="M3 8h4l2-3h6l2 3h4v12H3z" /><circle cx="12" cy="14" r="3" /></>,
    ar: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M12 6l6 3.5v5L12 18l-6-3.5v-5L12 6zM6 9.5l6 3.5 6-3.5M12 13v5" /></>,
    menu: <><path d="M3 7h18M3 12h18M3 17h18" /></>,
    check: <><path d="m4 12 5 5L20 6" /></>,
    reset: <><path d="M4 11a8 8 0 1 1 2 6M4 4v7h7" /></>,
  };
  return <svg {...shared}>{paths[name] || paths.arrow}</svg>;
}
