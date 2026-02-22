import { FOOTER_LINKS } from './footer.data';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna de Marca */}
        <div className="space-y-4">
          <h2 className="text-gray-500 text-xl font-bold">DeepSaffix-WEB</h2>
        </div>

        {/* Columnas Dinámicas de Enlaces */}
        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <h3 className="text-gray-500 font-semibold mb-4">{group.title}</h3>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-sm">
        <p>&copy; {currentYear} DeepSaffix-WEB Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};