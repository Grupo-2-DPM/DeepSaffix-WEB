interface Props {
  version: string;
  build: string;
}

export const FooterBrand: React.FC<Props> = ({ version, build }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <i
          className="fas fa-terminal text-accent-cyan text-sm"
          aria-hidden="true"
        />
        <span className="font-mono text-lg text-neutral-100 tracking-wide">
          DeepSaffix
        </span>
        <span className="rounded border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-500">
          {version}
        </span>
      </div>

      <p className="text-xs font-mono text-neutral-600">
        Build: {build}
      </p>
    </div>
  );
};