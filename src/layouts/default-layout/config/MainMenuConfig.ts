import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "products",
    route: "/products",
    pages: [
      {
        sectionTitle: "products",
        route: "/products",
        keenthemesIcon: "abstract-45",
        sub: [
          {
            heading: "products",
            route: "/apps/products/all",
          },
          {
            heading: "addProduct",
            route: "/apps/products/add",
          },
        ],
      },
      {
        sectionTitle: "categories",
        route: "/products",
        keenthemesIcon: "abstract-16",
        sub: [
          {
            heading: "categories",
            route: "/apps/categories",
          },
          {
            heading: "addCategories",
            route: "/apps/categories/add",
          },
        ],
      },
    ],
  },
  {
    heading: "Images",
    route: "/gallery",
    pages: [
      {
        sectionTitle: "gallery",
        route: "/gallery",
        keenthemesIcon: "abstract-20",
        sub: [
          {
            heading: "gallery",
            route: "/apps/gallery",
          },
          {
            heading: "addGallery",
            route: "/apps/gallery/add",
          },
        ],
      },
      {
        sectionTitle: "clients",
        route: "/Images",
        keenthemesIcon: "abstract-19",
        sub: [
          {
            heading: "clinets",
            route: "/apps/clients",
          },
          {
            heading: "addClient",
            route: "/apps/clients/add",
          },
        ],
      },
      {
        sectionTitle: "paterners",
        route: "/Images",
        keenthemesIcon: "chart",
        bootstrapIcon: "bi-printer",
        sub: [
          {
            heading: "paterners",
            route: "/apps/parteners",
          },
          {
            heading: "AddPaterner",
            route: "/apps/parteners/add",
          },
        ],
      },
    ],
  },
  {
    heading: "Forms",
    route: "/invests",
    pages: [
      {
        sectionTitle: "contacts",
        route: "/invests",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
        sub: [
          {
            heading: "contacts",
            route: "/apps/contacts",
          },
        ],
      },
      {
        sectionTitle: "invests",
        route: "/invests",
        keenthemesIcon: "abstract-42",
        sub: [
          {
            heading: "invests",
            route: "/apps/invests",
          },
        ],
      },
    ],
  },
  {
    heading: "Careers",
    route: "/careers",
    pages: [
      {
        sectionTitle: "careers",
        route: "/careers",
        keenthemesIcon: "abstract-13",
        sub: [
          {
            heading: "careers",
            route: "/apps/careers",
          },
        ],
      },
    ],
  },
  {
    heading: "settings",
    route: "/settings",
    pages: [
      {
        sectionTitle: "settings",
        route: "/settings",
        keenthemesIcon: "abstract-15",
        sub: [
          {
            heading: "settings",
            route: "/apps/website/settings",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
