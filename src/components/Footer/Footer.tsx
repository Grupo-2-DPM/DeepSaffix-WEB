import { FooterMeta } from "./FooterMeta";

interface FooterProps {
  version?: string;
  build?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={`h-14 border-t border-neutral-800 text-neutral-400 ${className}`}
    >
      <div className="py-5 md:px-4">
        <FooterMeta year={currentYear} />
      </div>
    </footer>
  );
};
