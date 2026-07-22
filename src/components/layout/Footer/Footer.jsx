import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@components/layout/Logo';
import { FOOTER_LINKS, APP_NAME, APP_TAGLINE } from '@constants/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@utils/index';

function FooterColumn({ title, links }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/60 md:border-none py-3.5 md:py-0">
      {/* Mobile interactive button / Desktop static heading */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left md:pointer-events-none md:block focus:outline-none"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-text transition-colors">
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
              className="text-sm text-text-secondary hover:text-text transition-colors duration-200 block py-1"
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
    <footer className="border-t border-border bg-surface/50">
      <div className="container-app py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-12">
          {/* Brand block */}
          <div className="col-span-1 md:col-span-2 space-y-3 pb-6 md:pb-0 border-b border-border/60 md:border-none">
            <Logo />
            <p className="text-sm text-text-secondary max-w-xs">{APP_TAGLINE}</p>
          </div>

          {/* Accordion columns */}
          <FooterColumn title="Platform" links={FOOTER_LINKS.platform} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>

        {/* Footer info bottom */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-text-muted">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built by Jeeshan Abbasi.
          </p>
        </div>
      </div>
    </footer>
  );
}
