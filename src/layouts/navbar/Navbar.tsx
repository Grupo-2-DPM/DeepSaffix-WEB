import { NAV_LINKS } from "./navbar,data";


export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white shadow-sm border-b border-gray-100">
      <div className="text-xl font-bold text-blue-600">DeepSaffix</div>

      <ul className="flex flex-wrap gap-4 sm:gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};