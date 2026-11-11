import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { nav, site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="bureau-footer">
      <div className="bureau-footer-inner">
        <div className="bureau-footer-about">
          <div className="flex items-center gap-4">
            <Qubi mood="happy" size={68} float={false} />
            <div>
              <p className="record-kicker">Archive guide</p>
              <p className="bureau-footer-title">Qubi</p>
            </div>
          </div>
          <p>{site.tagline}</p>
        </div>
        <nav aria-label="Footer navigation" className="bureau-footer-nav">
          <p className="record-kicker">Register index</p>
          <ul>{nav.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}</ul>
        </nav>
        <div className="bureau-footer-notes">
          <p className="record-kicker">Project record</p>
          <p>{site.course} · student group project.</p>
          <p>Interactive quantum demonstrations run in the browser. Video playback connects to YouTube only after a viewer starts an episode.</p>
          <Link to="/credits"><FileText size={15} aria-hidden="true" /> Sources and AI-use note <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link to="/team"><BookOpen size={15} aria-hidden="true" /> Team contributions <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link to="/about"><BookOpen size={15} aria-hidden="true" /> How to use the archive <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="bureau-footer-bottom">
        <span>© {new Date().getFullYear()} {site.course} group project</span>
        <span>Public archive / Quantum Lost-and-Found Bureau</span>
      </div>
    </footer>
  );
}
