import { FooterLinks } from "./FooterLinks";

interface Props {
  year: number;
}

export const FooterMeta: React.FC<Props> = ({ year }) => {
  return (
    <div className="flex flex-col gap-4 font-mono text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
      <p>© {year} DeepSaffix. All rights reserved.</p>

      <p>
        <FooterLinks></FooterLinks>
      </p>

      <p className="flex items-center gap-2">
        <span
          className="bg-accent-cyan h-2 w-2 rounded-full"
          aria-hidden="true"
        />
        Secure connection ·
      </p>
    </div>
  );
};
