import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import EventsPage from "@/pages/events";
import HomePage from "@/pages/home";
import Layout from "@/pages/layout";
import MemberShipPage from "@/pages/membership";
import MemberShipTable from "@/pages/memberTable";
import NewsPage from "@/pages/news";
import ReportsPage from "@/pages/reports";
import type { ReactElement } from "react";

// Route configuration types
export interface RouteConfig {
  path?: string;
  element: ReactElement;
  name?: string;
  children?: RouteConfig[];
}

// Route paths as constants
export const ROUTE_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  MemberShip:'/membership',
  News_Media:'/news-media',
  Events:'/events',
  Reports:'/reports',
  MemberList:'/member-list',
} as const;
const layoutRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: <HomePage />,
    name: "Home",
  },
  {
    path: ROUTE_PATHS.ABOUT,
    element: <AboutPage />,
    name: "About",
  },
  {
    path: ROUTE_PATHS.CONTACT,
    element: <ContactPage />,
    name: "Contact",
  },
  {
    path: ROUTE_PATHS.MemberShip,
    element: <MemberShipPage />,
    name: "MemberShip",
  },
  { 
    path: ROUTE_PATHS.News_Media,
    element: <NewsPage />,
    name: "News_Media",
  },
  {
    path: ROUTE_PATHS.Events,
    element: <EventsPage />,
    name: "Events",
  },
  {
    path: ROUTE_PATHS.Reports,
    element: <ReportsPage />,
    name: "Reports",
  },
  {
    path: ROUTE_PATHS.MemberList,
    element: <MemberShipTable/>,
    name: "MemberList",
  }
  // {
  //   path: ROUTE_PATHS.CONTACT,
  //   element: <ContactPage />,
  //   name: "Contact",
  // },
];

export const publicRoutes: RouteConfig[] = [
  {
    element: <Layout/>,
    children: layoutRoutes,     // Nested pages
  },
];

// Protected routes (require authentication)
export const protectedRoutes: RouteConfig[] = [
  // Example:
  // {
  //   path: "/dashboard",
  //   element: <DashboardPage />,
  //   name: "Dashboard",
  // },
];

// Main route configuration
export const routeConfig: RouteConfig[] = [
  ...publicRoutes,

  // Protected route wrapper with no direct path
//   {
//     element: <ProtectedRoute />,
//     children: protectedRoutes,
//   },

//   {
//     path: "*",
//     element: <NotFoundPage />,
//   },
];
