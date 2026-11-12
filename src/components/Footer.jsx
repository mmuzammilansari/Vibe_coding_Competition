import { goToSection } from '../lib/motion';
import { Icon } from './Icons';
export default function Footer() {
  return <footer id="footer" className="footer section-shell">
    <div className="footer-top"><div><span className="eyebrow">END OF THE ROAD / START OF THE NEXT</span>
      <h2>GO<br/><em>BEYOND.</em></h2></div><button type="button" className="button-primary" onClick={() => goToSection('test-drive')}>BOOK A TEST DRIVE <Icon name="diagonal" size={18}/></button></div>
    <div className="footer-mark" aria-hidden="true">NØCTIS</div>
    <div className="footer-bottom"><div><strong>NOCTIS / 2026</strong><p>Fictional electric vehicle brand. Sample data / fictional. No actual vehicles, sales or test drives exist.</p></div>
      <div><strong>PROTOTYPE CREDITS</strong><p>3D model: “CarConcept” © 2024 Darmstadt Graphics Group GmbH, CC BY 4.0, via Khronos glTF-Sample-Assets (modified: texture compression, paint recolor). Fonts: Google Fonts — Big Shoulders Display, IBM Plex Sans, JetBrains Mono. Libraries: React, Vite, GSAP, Lenis, Zustand, SplitType, model-viewer.</p></div>
      <div><strong>COMPETITION</strong><p>ACM MAJU Vibe Coding Competition</p><button type="button" onClick={() => goToSection('hero')}>BACK TO TOP</button></div></div>
  </footer>;
}
