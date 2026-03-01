import { FOOTER_LINKS } from "./footer.data";

export const FooterLinks = () => {
  return (
    <nav aria-label="Footer navigation">
      <ul className="flex flex-wrap gap-x-2 gap-y-2 justify-center">
        {FOOTER_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm font-medium text-neutral-400
                         hover:text-accent-cyan
                         focus:outline-none focus:ring-2 focus:ring-accent-cyan
                         transition-colors duration-150"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};