import { type SidebarItemType } from "./sidebar.types";

interface Props {
  item: SidebarItemType;
  active: boolean;
  collapsed: boolean;
}

export const SidebarItem: React.FC<Props> = ({
  item,
  active,
  collapsed,
}) => {
  return (
    <li>
      <a
        href={item.href}
        className={`
          flex items-center gap-3
          px-3 py-2.5
          rounded-lg
          text-sm font-medium
          transition-colors
          ${active
            ? "bg-neutral-900 text-white"
            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}
          ${item.disabled ? "opacity-50 pointer-events-none" : ""}
        `}
        aria-current={active ? "page" : undefined}
      >
        {item.icon && (
          <span className="w-5 text-center">{item.icon}</span>
        )}

        {!collapsed && (
          <span>{item.label}</span>
        )}
      </a>
    </li>
  );
};