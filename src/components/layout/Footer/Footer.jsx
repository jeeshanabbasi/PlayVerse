import { Link } from 'react-router-dom';
import { Logo } from '@components/layout/Logo';
import { FOOTER_LINKS, APP_NAME, APP_TAGLINE } from '@constants/navigation';

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-label mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map(({ label, path }) => (
          <li key={path}>
            <Link
              to={path}
              className="text-body-md text-text-secondary hover:text-text transition-colors duration-250"
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
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-body-md max-w-xs">{APP_TAGLINE}</p>
          </div>

          <FooterColumn title="Platform" links={FOOTER_LINKS.platform} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-body-sm">
            Built for gamers, by gamers.
          </p>
        </div>
      </div>
    </footer>
  );
}
