interface LinkItem {
  label: string;
  href: string;
}

interface Props {
  link: LinkItem;
  isActive: boolean;
  onNavigate: () => void;
}

export const SidebarItem: React.FC<Props> = ({
  link,
  isActive,
  onNavigate,
}) => {
  return (
    <li>
      <a
        href={link.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`
          group flex items-center gap-3 px-4 py-3 rounded-lg
          text-sm font-medium tracking-wide
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-accent-cyan
          ${isActive
            ? "bg-neutral-900 text-accent-cyan border-l-2 border-accent-cyan"
            : "text-neutral-400 hover:bg-neutral-900 hover:text-accent-cyan"}
        `}
      >
        <span
          className="text-[10px] font-mono text-neutral-600"
          aria-hidden="true"
        >
          {isActive ? ">" : "$"}
        </span>
        {link.label}
      </a>
    </li>
  );
};