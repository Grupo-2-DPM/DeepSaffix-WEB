import { FooterBrand } from "./FooterBrand";
import { FooterLinks } from "./FooterLinks";
import { FooterMeta } from "./FooterMeta";

interface FooterProps {
  version?: string;
  build?: string;
  protocolVersion?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  version = "v1.0.0",
  build = "2025.02.21_12:30",
  protocolVersion = "v2.3",
  className = "",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={`border-t border-neutral-800 bg-neutral-950 text-neutral-400 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <FooterBrand version={version} build={build} />
          <FooterLinks />
        </div>

        <FooterMeta
          year={currentYear}
          protocolVersion={protocolVersion}
        />
      </div>
    </footer>
  );
};