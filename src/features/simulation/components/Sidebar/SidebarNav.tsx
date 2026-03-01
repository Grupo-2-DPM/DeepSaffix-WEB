import { SIDE_LINKS } from "./sidebar.data";
import { SidebarItem } from "./SidebarItem";

interface Props {
  activePath: string;
  onNavigate: () => void;
}

export const SidebarNav: React.FC<Props> = ({
  activePath,
  onNavigate,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-4">
      <ul className="space-y-1">
        {SIDE_LINKS.map((link) => (
          <SidebarItem
            key={link.href}
            link={link}
            isActive={activePath === link.href}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
};