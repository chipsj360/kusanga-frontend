// sidebarConfig.js
export const SIDEBAR_ITEMS = [
  {
    label: "Courses",
    path: "/courses",
    icon: "ph ph-graduation-cap",
    roles: ["student", "trainer", "admin"],
  },
  {
    label: "Students",
    path: "/users",
    icon: "ph ph-users-three",
    roles: ["trainer", "admin"], // hidden from students
  },
  {
    label: "Modules",
    path: "/modules",
    icon: "ph ph-clipboard-text",
    roles: ["trainer", "admin"],
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "ph ph-chart-bar",
    roles: ["admin"],
  },
];
