import { FOOTER_LINKS } from "./footer.data";

export const FooterLinks = () => {
  return (
    <nav aria-label="Footer navigation">
      <ul className="flex flex-wrap justify-center gap-x-2 gap-y-2">
        {FOOTER_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="hover:text-accent-cyan focus:ring-accent-cyan text-sm font-medium text-neutral-400 transition-colors duration-150 focus:ring-2 focus:outline-none"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
