const routes = [
  ,
  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/",
        name: "Login",
        component: () => import("pages/LoginPage.vue")
      }
    ]
  },
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("pages/HomePage.vue")
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("pages/ProfilePage.vue")
      },
      {
        path: "/suppliers",
        name: "Suppliers",
        component: () => import("pages/SuppliersPage.vue")
      },
      {
        path: "/invoices",
        name: "Invoices",
        component: () => import("pages/InvoicesPage.vue")
      },
      {
        path: "/payments",
        name: "Payments",
        component: () => import("pages/PaymentsPage.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
