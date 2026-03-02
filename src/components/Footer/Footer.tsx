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
      className={`h-10 border-t border-neutral-800 text-neutral-400 ${className}`}
    >
      <div className="flex h-full items-center justify-center px-4 text-xs">
        <FooterMeta year={currentYear} />
      </div>
    </footer>
  );
};
