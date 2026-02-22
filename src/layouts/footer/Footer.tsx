import { FOOTER_LINKS } from './footer.data'; // Se mantiene import aunque luego usemos datos propios

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 px-6 border-t border-neutral-800 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Primera fila: marca y enlaces */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Marca con estilo consola */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <i className="fas fa-terminal text-accent-cyan text-sm"></i>
              <span className="text-white font-mono text-lg tracking-wider">DeepSaffix</span>
              <span className="text-[10px] font-bold tracking-widest text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-neutral-600">
              BUILD: 2025.02.21_12:30
            </p>
          </div>

          {/* Enlaces mínimos */}
          <nav className="flex flex-wrap gap-6 md:gap-8">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase transition-all duration-200 hover:text-accent-cyan active:scale-95"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Línea divisoria y copyright técnico */}
        <div className="border-t border-neutral-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-neutral-600">
          <p>© {currentYear} DEEPSAFFIX · TODOS LOS DERECHOS RESERVADOS</p>
          <p className="flex items-center gap-2 mt-2 sm:mt-0">
            <i className="fas fa-circle text-[6px] text-accent-cyan"></i>
            <span>CONEXIÓN SEGURA · PROTOCOLO v2.3</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// El archivo footer.data.js puede quedar intacto, pero no se usa. 
// Si quieres limpiar, puedes eliminar el import y definir FOOTER_LINKS en otro lado.