import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@components/layout/Logo';
import { FOOTER_LINKS, APP_NAME, APP_TAGLINE } from '@constants/navigation';
import { ChevronDown, Globe, Activity } from 'lucide-react';
import { cn, playUiTick, playUiClick } from '@utils/index';

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function FooterColumn({ title, links }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/60 md:border-none py-3.5 md:py-0">
      {/* Mobile interactive button / Desktop static heading */}
      <button
        type="button"
        onClick={() => {
          playUiClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={playUiTick}
        className="flex w-full items-center justify-between text-left md:pointer-events-none md:block focus:outline-none group"
      >
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text transition-colors">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted md:hidden transition-transform duration-200',
            isOpen && 'rotate-180 text-text'
          )}
        />
      </button>

      {/* Accordion link list wrapper */}
      <ul
        className={cn(
          'space-y-2 mt-3 md:mt-4 transition-all duration-300 md:block overflow-hidden',
          isOpen ? 'max-h-60 opacity-100 visible' : 'max-h-0 opacity-0 invisible md:max-h-none md:opacity-100 md:visible'
        )}
      >
        {links.map(({ label, path }) => (
          <li key={label}>
            <Link
              to={path}
              onClick={playUiClick}
              onMouseEnter={playUiTick}
              className="text-xs font-medium text-text-secondary hover:text-primary transition-colors duration-200 block py-1"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface/30 backdrop-blur-sm overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(ellipse 400px 100px at 50% 120px, rgba(124, 58, 237, 0.04), transparent 70%)'
        }}
        aria-hidden="true" 
      />

      <div className="container-app relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-12">
          {/* Brand block */}
          <div className="col-span-1 md:col-span-2 space-y-4 pb-6 md:pb-0 border-b border-border/60 md:border-none text-left">
            <Logo />
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">{APP_TAGLINE}</p>
            
            {/* Pulsing Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/15 text-[10px] font-medium text-success">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation link columns */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FooterColumn title="Platform" links={FOOTER_LINKS.platform} />
            <FooterColumn title="Company" links={FOOTER_LINKS.company} />
            <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
          </div>

          {/* Social connections block */}
          <div className="col-span-1 space-y-4 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Connect
            </h3>
            <p className="text-[11px] text-text-muted">Join the arcade community.</p>
            
            {/* Social media icons grid */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onClick={playUiClick}
                onMouseEnter={playUiTick}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-primary/45 hover:shadow-[var(--shadow-glow)] transition-all duration-250 cursor-pointer"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                onClick={playUiClick}
                onMouseEnter={playUiTick}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-primary/45 hover:shadow-[var(--shadow-glow)] transition-all duration-250 cursor-pointer"
                aria-label="Twitter Account"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://playverse.com"
                target="_blank"
                rel="noreferrer"
                onClick={playUiClick}
                onMouseEnter={playUiTick}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text hover:border-primary/45 hover:shadow-[var(--shadow-glow)] transition-all duration-250 cursor-pointer"
                aria-label="Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer info bottom strip */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-text-muted">
          <p className="font-medium">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="font-semibold text-text-secondary hover:text-primary transition-colors cursor-default">
            Built by Jeeshan Abbasi.
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded bg-border/40 border border-border/60">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>OS v1.4.0 (Stable)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
