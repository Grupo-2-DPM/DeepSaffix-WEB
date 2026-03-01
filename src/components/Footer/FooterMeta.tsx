import { FooterLinks } from "./FooterLinks";

interface Props {
  year: number;
  protocolVersion: string;
}

export const FooterMeta: React.FC<Props> = ({
  year,
  protocolVersion,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-neutral-600">
      <p>
        © {year} DeepSaffix. All rights reserved.
      </p>

      <p>
        <FooterLinks></FooterLinks>
      </p>

      <p className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-accent-cyan"
          aria-hidden="true"
        />
        Secure connection · Protocol {protocolVersion}
      </p>
    </div>
  );
};