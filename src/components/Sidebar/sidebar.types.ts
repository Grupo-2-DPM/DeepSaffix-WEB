export interface SidebarItemType {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}