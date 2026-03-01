// sidebar.data.ts
import type { SidebarItemType } from "./sidebar.types";

export const SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    id: "home",
    label: "Inicio",
    href: "#/",
  },
  {
    id: "profile",
    label: "Perfil",
    href: "#/profile",
  },
  {
    id: "overview",
    label: "Overview",
    href: "#/overview",
  },
  {
    id: "about",
    label: "Saber Más",
    href: "#/about",
  },
];