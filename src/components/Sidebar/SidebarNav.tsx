import { type SidebarItemType } from "./sidebar.types";
import { SidebarItem } from "./SidebarItem";

interface Props {
  items: SidebarItemType[];
  activePath: string;
  collapsed: boolean;
}

export const SidebarNav: React.FC<Props> = ({
  items,
  activePath,
  collapsed,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-2">
      <ul className="space-y-1">
        {items.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activePath === item.href}
            collapsed={collapsed}
          />
        ))}
      </ul>
    </nav>
  );
};