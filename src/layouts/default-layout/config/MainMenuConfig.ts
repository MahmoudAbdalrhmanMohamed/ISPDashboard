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
    heading: "apps",
    route: "/apps",
    pages: [
      // {
      //   sectionTitle: "Publishers",
      //   route: "/publishers",
      //   keenthemesIcon: "technology-3",
      //   bootstrapIcon: "bi-printer",
      //   sub: [
      //     {
      //       heading: "Publishers",
      //       route: "/apps/publishers/all",
      //     },
      //     {
      //       heading: "Add Publisher",
      //       route: "/apps/publishers/addPublisher",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Artists",
      //   route: "/artists",
      //   keenthemesIcon: "abstract-38",
      //   bootstrapIcon: "bi-printer",
      //   sub: [
      //     {
      //       heading: "Artists",
      //       route: "/apps/artists/all",
      //     },
      //     {
      //       heading: "Add Artist",
      //       route: "/apps/artists/addArtist",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Writers",
      //   route: "/writers",
      //   keenthemesIcon: "chart",
      //   bootstrapIcon: "bi-printer",
      //   sub: [
      //     {
      //       heading: "Writers",
      //       route: "/apps/writers/all",
      //     },
      //     {
      //       heading: "Add Writer",
      //       route: "/apps/writers/addWriter",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Genres",
      //   route: "/genres",
      //   keenthemesIcon: "graph-up",
      //   bootstrapIcon: "bi-printer",
      //   sub: [
      //     {
      //       heading: "Genres",
      //       route: "/apps/genres/all",
      //     },
      //     {
      //       heading: "Add Genre",
      //       route: "/apps/genres/addGenre",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Chapters",
      //   route: "/chapters",
      //   keenthemesIcon: "book",
      //   bootstrapIcon: "bi-journal-text",
      //   sub: [
      //     {
      //       heading: "All Chapters",
      //       route: "/apps/chapters/all",
      //     },
      //     {
      //       heading: "Add One Chapter",
      //       route: "/apps/chapters/addOneChapter",
      //     },
      //     {
      //       heading: "Add All Chapters",
      //       route: "/apps/chapters/addAllChapter",
      //     },
      //     // {
      //     //   heading: "Add Url",
      //     //   route: "/apps/chapters/addUrl",
      //     // },
      //     // {
      //     //   heading: "Add Zip",
      //     //   route: "/apps/chapters/addZip",
      //     // },
      //     // {
      //     //   heading: "updateOneChapter",
      //     //   route: "/apps/chapters/updateOneChapter/:updateChapter",
      //     // },
      //     // {
      //     //   heading: "updateAllChapters",
      //     //   route: "/apps/chapters/updateAllChapter/:updateChapter",
      //     // },
      //     // {
      //     //   heading: "updateUrl",
      //     //   route: "/apps/chapters/updateUrl/:updateUrl",
      //     // },
      //     // {
      //     //   heading: "updateZip",
      //     //   route: "/apps/chapters/updateZip/:updateZip",
      //     // },
      //   ],
      // },

      // {
      //   sectionTitle: "Comics",
      //   route: "/comics",
      //   bootstrapIcon: "bi-book",
      //   keenthemesIcon: "soft",
      //   sub: [
      //     {
      //       heading: "Comics",
      //       route: "/apps/comics/all",
      //     },
      //     {
      //       heading: "Add Comic",
      //       route: "/apps/comics/addComic",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Translators",
      //   route: "/translators",
      //   keenthemesIcon: "abstract-20",
      //   sub: [
      //     {
      //       heading: "Translators",
      //       route: "/apps/translators/Translators",
      //     },
      //     {
      //       heading: "Translate Requests Comics",
      //       route: "/apps/translators/comic",
      //     },
      //     {
      //       heading: "Translate Requests Chapters",
      //       route: "/apps/translators/chapter",
      //     },
      //     {
      //       heading: "Translate Requests To Join",
      //       route: "/apps/translators/RequestToJoin",
      //     },
      //   ],
      // },

      // {
      //   sectionTitle: "Users",
      //   route: "/users",
      //   keenthemesIcon: "abstract-45",
      //   sub: [
      //     {
      //       heading: "Users",
      //       route: "/apps/users",
      //     },
      //   ],
      // },

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
        sectionTitle: "gallery",
        route: "/gallery",
        keenthemesIcon: "abstract-20",
        sub: [
          // {
          //   heading: "galleryTest",
          //   route: "/apps/gallery/all",
          // },
          {
            heading: "gallery",
            route: "/apps/gallery",
          },
          {
            heading: "addGallery",
            route: "/apps/gallery",
          },
        ],
      },
      {
        sectionTitle: "contacts",
        route: "/contacts",
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
        sectionTitle: "clinets",
        route: "/clinets",
        keenthemesIcon: "abstract-19",
        sub: [
          {
            heading: "clinets",
            route: "/apps/clinets",
          },
          {
            heading: "addClinet",
            route: "/apps/clinets/add",
          },
        ],
      },
      {
        sectionTitle: "paterners",
        route: "/apps/paterners",
        keenthemesIcon: "chart",
        bootstrapIcon: "bi-printer",
        sub: [
          {
            heading: "paterners",
            route: "/apps/paterners",
          },
          {
            heading: "AddPaterner",
            route: "/apps/parteners/add",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
