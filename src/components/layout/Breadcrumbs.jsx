import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { uiContent } from '../../config/ui-content';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  if (pathname === '/' || pathname === '/dashboard') return null;

  return (
    <nav className="flex mb-6 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/dashboard" className="text-slate-400 hover:text-brand-600 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {last ? (
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  {label}
                </span>
              ) : (
                <Link to={to} className="text-xs font-bold text-slate-400 hover:text-brand-600 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
