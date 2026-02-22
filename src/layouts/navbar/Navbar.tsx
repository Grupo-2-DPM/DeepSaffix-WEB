import { NAV_LINKS } from "./navbar.data";

export const Navbar = () => {
  return (
    <nav className="bg-neutral-950 border-b border-neutral-800 py-3 px-4 sm:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + versión (estilo consola) */}
        <div className="flex items-center gap-2">
          <i className="fas fa-terminal text-accent-cyan text-sm"></i>
          <span className="text-white font-mono text-lg tracking-wider">DeepSaffix</span>
          <span className="text-[10px] font-bold tracking-widest text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
            v1.0.0
          </span>
        </div>

        {/* Enlaces de navegación (mayúsculas, mini, con hover cyan) */}
        <ul className="flex flex-wrap gap-6 md:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase transition-all duration-200 hover:text-accent-cyan active:scale-95"
              >
                {link.label}s
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};