import { FooterMeta } from "./FooterMeta";

interface FooterProps {
  version?: string;
  build?: string;
  protocolVersion?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  protocolVersion = "v2.4",
  className = "",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={`border-neutral-800 text-neutral-400 ${className}`}
    >
      <div className="md:px-4 py-5">
        <FooterMeta
          year={currentYear}
          protocolVersion={protocolVersion}
        />
      </div>
    </footer>
  );
};