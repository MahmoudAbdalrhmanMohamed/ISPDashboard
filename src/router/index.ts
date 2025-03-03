import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// import { useI18n } from "vue-i18n";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },

      {
        path: "/apps/website/settings",
        name: "apps-website-settings",
        component: () => import("@/views/apps/writers/addWriter.vue"),
        meta: {
          pageTitle: "settings",
          breadcrumbs: ["Apps", "website", "settings"],
        },
      },

      {
        path: "/apps/admins/updateName",
        name: "apps-admins-updateName",
        component: () => import("@/views/apps/admins/UpdateName.vue"),
        meta: {
          pageTitle: "updateName",
          breadcrumbs: ["Apps", "Admins", "Update Name"],
        },
      },
      {
        path: "/apps/admins/updateImage",
        name: "apps-admins-updateImage",
        component: () => import("@/views/apps/admins/UpdateImage.vue"),
        meta: {
          pageTitle: "updateImage",
          breadcrumbs: ["Apps", "Admins", "Update Image"],
        },
      },
      {
        path: "/apps/admins/updatePassword",
        name: "apps-admins-updatePassword",
        component: () => import("@/views/apps/admins/UpdatePasword.vue"),
        meta: {
          pageTitle: "updatePassword",
          breadcrumbs: ["Apps", "Admins", "Update Password"],
        },
      },
      {
        path: "/apps/products/all",
        name: "apps-products-all",
        component: () => import("@/views/apps/products/ProductsComponent.vue"),
        meta: {
          pageTitle: "products",
          breadcrumbs: ["Apps", "products"],
        },
      },
      {
        path: "/apps/products/add",
        name: "apps-products-add",
        component: () => import("@/views/apps/products/addProducts.vue"),
        meta: {
          pageTitle: "addProduct",
          breadcrumbs: ["Apps", "products", "addProduct"],
        },
      },
      {
        path: "/apps/products/update/:product",
        name: "apps-products-update",
        component: () => import("@/views/apps/products/updateProducts.vue"),
        meta: {
          pageTitle: "updateProduct",
          breadcrumbs: ["Apps", "products", "updateProduct"],
        },
      },
      {
        path: "/apps/blogs/all",
        name: "apps-blogs-all",
        component: () => import("@/views/apps/blogs/BlogsComponent.vue"),
        meta: {
          pageTitle: "blogs",
          breadcrumbs: ["Apps", "blogs"],
        },
      },
      {
        path: "/apps/blog/add",
        name: "apps-blog-add",
        component: () => import("@/views/apps/blogs/addBlog.vue"),
        meta: {
          pageTitle: "addBlog",
          breadcrumbs: ["Apps", "blogs", "addBlog"],
        },
      },
      {
        path: "/apps/blog/update/:blog",
        name: "apps-blog-update",
        component: () => import("@/views/apps/blogs/updateBlog.vue"),
        meta: {
          pageTitle: "updateBlog",
          breadcrumbs: ["Apps", "blogs", "updateBlog"],
        },
      },

      {
        path: "/apps/gallery/all",
        name: "apps-gallery-all",
        component: () => import("@/views/apps/gallery/test.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery"],
        },
      },
      {
        path: "/apps/gallery",
        name: "apps-gallery",
        component: () => import("@/views/apps/gallery/GalleryComponent.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery"],
        },
      },
      {
        path: "/apps/gallery/add",
        name: "apps-gallery-add",
        component: () => import("@/views/apps/gallery/addGallery.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery", "add"],
        },
      },
      {
        path: "/apps/gallery/update/:gallery",
        name: "apps-gallery-update",
        component: () => import("@/views/apps/gallery/updateGallery.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery", "update"],
        },
      },

      {
        path: "/apps/gallery",
        name: "apps-gallery",
        component: () => import("@/views/apps/gallery/GalleryComponent.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery"],
        },
      },
      {
        path: "/apps/gallery/add",
        name: "apps-gallery-add",
        component: () => import("@/views/apps/gallery/addGallery.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery", "add"],
        },
      },
      {
        path: "/apps/gallery/update/:gallery",
        name: "apps-gallery-update",
        component: () => import("@/views/apps/gallery/updateGallery.vue"),
        meta: {
          pageTitle: "gallery",
          breadcrumbs: ["Apps", "gallery", "update"],
        },
      },

      {
        path: "/apps/categories",
        name: "apps-categories",
        component: () =>
          import("@/views/apps/categories/CategoriesComponent.vue"),
        meta: {
          pageTitle: "categories",
          breadcrumbs: ["Apps", "categories"],
        },
      },
      {
        path: "/apps/categories/add",
        name: "apps-categories-add",
        component: () => import("@/views/apps/categories/addCategories.vue"),
        meta: {
          pageTitle: "categories",
          breadcrumbs: ["Apps", "categories", "add"],
        },
      },
      {
        path: "/apps/categories/update/:id",
        name: "apps-categories-update",
        component: () => import("@/views/apps/categories/updateCategories.vue"),
        meta: {
          pageTitle: "categories",
          breadcrumbs: ["Apps", "categories", "update"],
        },
      },
      {
        path: "/apps/clients",
        name: "apps-clients",
        component: () => import("@/views/apps/ourClients/ClientsComponent.vue"),
        meta: {
          pageTitle: "clinets",
          breadcrumbs: ["Apps", "clinets"],
        },
      },
      {
        path: "/apps/clients/add",
        name: "apps-clients-add",
        component: () => import("@/views/apps/ourClients/addClient.vue"),
        meta: {
          pageTitle: "clinets",
          breadcrumbs: ["Apps", "clinets", "add"],
        },
      },
      {
        path: "/apps/clients/update/:clients",
        name: "apps-clients-update",
        component: () => import("@/views/apps/ourClients/updateClient.vue"),
        meta: {
          pageTitle: "clients",
          breadcrumbs: ["Apps", "clients", "update"],
        },
      },
      {
        path: "/apps/parteners",
        name: "apps-parteners",
        component: () =>
          import("@/views/apps/parteners/PaternersComponent.vue"),
        meta: {
          pageTitle: "parteners",
          breadcrumbs: ["Apps", "parteners"],
        },
      },
      {
        path: "/apps/parteners/add",
        name: "apps-parteners-add",
        component: () => import("@/views/apps/parteners/addPaterner.vue"),
        meta: {
          pageTitle: "parteners",
          breadcrumbs: ["Apps", "parteners", "add"],
        },
      },
      {
        path: "/apps/parteners/update/:parteners",
        name: "apps-parteners-update",
        component: () => import("@/views/apps/parteners/updatePaterner.vue"),
        meta: {
          pageTitle: "parteners",
          breadcrumbs: ["Apps", "parteners", "update"],
        },
      },
      {
        path: "/apps/contacts",
        name: "apps-contacts",
        component: () =>
          import("@/views/apps/contacts/PublishersComponent.vue"),
        meta: {
          pageTitle: "contacts",
          breadcrumbs: ["Apps", "contacts"],
        },
      },
      {
        path: "/apps/contacts/:id",
        name: "apps-contacts-one",
        component: () => import("@/views/apps/contacts/ContactUser.vue"),
        meta: {
          pageTitle: "contacts",
          breadcrumbs: ["Apps", "contacts", "one"],
        },
      },
      {
        path: "/apps/careers",
        name: "apps-careers",
        component: () => import("@/views/apps/careers/CareersComponent.vue"),
        meta: {
          pageTitle: "careers",
          breadcrumbs: ["Apps", "careers"],
        },
      },
      {
        path: "/apps/careers/user/:id",
        name: "apps-careers/user",
        component: () => import("@/views/apps/careers/UserComponent.vue"),
        meta: {
          pageTitle: "careers",
          breadcrumbs: ["Apps", "careers", "careerRequets"],
        },
      },
      {
        path: "/apps/invests",
        name: "apps-invests",
        component: () => import("@/views/apps/invests/InvestComponent.vue"),
        meta: {
          pageTitle: "invests",
          breadcrumbs: ["Apps", "invests"],
        },
      },
      {
        path: "/apps/invests/user/:id",
        name: "apps-invests/user",
        component: () => import("@/views/apps/invests/InvestUser.vue"),
        meta: {
          pageTitle: "invests",
          breadcrumbs: ["Apps", "invests", "investRequets"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  const token = localStorage.getItem("authToken");

  if (token) {
    // Prevent authenticated users from visiting the sign-in page
    if (to.name === "sign-in") {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else {
    // Avoid redirecting to sign-in if already there
    if (to.name === "sign-in") {
      next(); // Already on the sign-in page
    } else {
      next({ name: "sign-in" }); // Redirect to sign-in for other routes
    }
  }
});

export default router;
