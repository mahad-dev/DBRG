import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import DashboardLayout from "@/pages/dashboard/layout";
import MemberDirectory from "@/pages/dashboard/MemberDirectory";
import Notifications from "@/pages/dashboard/Notifications";
import ResourceLibrary from "@/pages/dashboard/ResourseLibrary";
import TrackingStatus from "@/pages/dashboard/TrackStatus";
import UpcomingEvents from "@/pages/dashboard/UpcomingEvents";
import UploadDetails from "@/pages/dashboard/UploadDetails";
import MemberSettings from "@/pages/dashboard/Settings";
import EventsPage from "@/pages/events";
import HomePage from "@/pages/home";
import Layout from "@/pages/layout";
import MemberShipPage from "@/pages/membership";
import MemberShipTable from "@/pages/memberTable";
import NewsPage from "@/pages/news";
import ReportsPage from "@/pages/reports";
import Signup from "@/pages/auth/Signup";
import AdminLogin from "@/pages/auth/AdminLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import type { ReactElement } from "react";
import Login from "@/pages/auth/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import ApplicationGuard from "@/components/ApplicationGuard";

import AdminDashboardLayout from "@/pages/adminDashboard/layout";
import UserManagement from "@/pages/adminDashboard/UserManagement";
import SendNotifications from "@/pages/adminDashboard/SendNotifications";
import CMS from "@/pages/adminDashboard/CMS";
import EventRegistrations from "@/pages/adminDashboard/CMS/EventRegistrations";
import PaymentDetails from "@/pages/adminDashboard/PaymentDetails";
import SpecialConsideration from "@/pages/adminDashboard/SpecialConsideration";
import Settings from "@/pages/adminDashboard/Settings";
import AdminDashboard from "@/pages/adminDashboard";
import Applications from "@/pages/adminDashboard/Applications";
import ApprovedApplications from "@/pages/adminDashboard/ApprovedApplications";
import ViewApplication from "@/pages/adminDashboard/Applications/ViewApplication";
import UploadDetailsMemberBank from "@/pages/dashboard/UploadDetails/memberBank";
import UploadDetailsContributingMember from "../pages/dashboard/UploadDetails/contributingMember";
import UploadDetailsAffiliateMember from "@/pages/dashboard/UploadDetails/affiliateMember";
import UploadDetailsPrincipalMember from "@/pages/dashboard/UploadDetails/principalMember";
import EventDetails from "@/pages/dashboard/UpcomingEvents/EventDetails";

// Route configuration type
export interface RouteConfig {
  path?: string;
  element: ReactElement;
  name?: string;
  children?: RouteConfig[];
}

// MAIN ROUTE CONSTANTS
export const ROUTE_PATHS = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  MemberShip: "/membership",
  News_Media: "/news-media",
  Events: "/events",
  Reports: "/reports",
  MemberList: "/member-list",
} as const;

/* ---------------------------------------------------------
PUBLIC WEBSITE ROUTES
--------------------------------------------------------- */
const layoutRoutes: RouteConfig[] = [
  { path: ROUTE_PATHS.HOME, element: <HomePage />, name: "Home" },
  { path: ROUTE_PATHS.ABOUT, element: <AboutPage />, name: "About" },
  { path: ROUTE_PATHS.CONTACT, element: <ContactPage />, name: "Contact" },
  { path: ROUTE_PATHS.MemberShip, element: <MemberShipPage />, name: "MemberShip" },
  { path: ROUTE_PATHS.News_Media, element: <NewsPage />, name: "News_Media" },
  { path: ROUTE_PATHS.Events, element: <EventsPage />, name: "Events" },
  { path: ROUTE_PATHS.Reports, element: <ReportsPage />, name: "Reports" },
  { path: ROUTE_PATHS.MemberList, element: <MemberShipTable />, name: "MemberList" },
];

/* ---------------------------------------------------------
USER DASHBOARD ROUTES (/dashboard)
--------------------------------------------------------- */
const dashboardLayoutRoutes: RouteConfig[] = [
  { path: "", element: <ApplicationGuard><Dashboard /></ApplicationGuard>, name: "Dashboard" },
  { path: "upcoming-events", element: <ApplicationGuard><UpcomingEvents /></ApplicationGuard>, name: "UpcomingEvents" },
  { path: "upcoming-events/:id", element: <ApplicationGuard><EventDetails /></ApplicationGuard>, name: "EventDetails" },
  { path: "track-status", element: <TrackingStatus />, name: "TrackingStatus" },
  { path: "members-directory", element: <ApplicationGuard><MemberDirectory /></ApplicationGuard>, name: "MemberDirectory" },
  { path: "resource-library", element: <ApplicationGuard><ResourceLibrary /></ApplicationGuard>, name: "ResourceLibrary" },
  { path: "notifications", element: <ApplicationGuard><Notifications /></ApplicationGuard>, name: "Notifications" },
  { path: "settings", element: <MemberSettings />, name: "MemberSettings" },
  { path: "upload-details", element: <ApplicationGuard requireCompleted={false}><UploadDetails /></ApplicationGuard>, name: "UploadDetails" },
  { path: "member-type/principal-member/upload-details", element: <ApplicationGuard requireCompleted={false}><UploadDetailsPrincipalMember /></ApplicationGuard>, name: "UploadDetailsPrincipalMember" },
  { path: "member-type/member-bank/upload-details", element: <ApplicationGuard requireCompleted={false}><UploadDetailsMemberBank /></ApplicationGuard>, name: "UploadDetailsMemberBank" },
  { path: "member-type/contributing-member/upload-details", element: <ApplicationGuard requireCompleted={false}><UploadDetailsContributingMember /></ApplicationGuard>, name: "UploadDetailsContributingMember" },
  { path: "member-type/affiliate-member/upload-details", element: <ApplicationGuard requireCompleted={false}><UploadDetailsAffiliateMember /></ApplicationGuard>, name: "UploadDetailsAffiliateMember" },
];

/* ---------------------------------------------------------
ADMIN PANEL ROUTES (/admin/dashboard)
--------------------------------------------------------- */
const adminDashboardRoutes: RouteConfig[] = [
  { path: "", element: <AdminDashboard />, name: "AdminDashboard" },
  { path: "user-management", element: <UserManagement />, name: "UserManagement" },
  { path: "send-notification", element: <SendNotifications />, name: "SendNotifications" },
  { path: "cms", element: <CMS />, name: "CMS" },
  { path: "cms/event-registrations/:eventId", element: <EventRegistrations />, name: "EventRegistrations" },
  { path: "payment-details", element: <PaymentDetails />, name: "PaymentDetails" },
  { path: "special-consideration", element: <SpecialConsideration />, name: "SpecialConsideration" },
  { path: "settings", element: <Settings />, name: "Settings" },
  { path: "applications", element: <Applications />, name: "Applications" },
  { path: "applications/view", element: <ViewApplication />, name: "ViewApplication" },
  { path: "approved-applications", element: <ApprovedApplications />, name: "ApprovedApplications" },
];

/* ---------------------------------------------------------
PUBLIC ROUTES CONFIG
--------------------------------------------------------- */
export const publicRoutes: RouteConfig[] = [
  {
    element: <Layout />,
    children: layoutRoutes,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute requiredRole="member"><DashboardLayout /></ProtectedRoute>,
    children: dashboardLayoutRoutes,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    name: "AdminLogin",
  },
  {
    path: "/login",
    element: <Login />,
    name: "Login",
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    name: "ForgotPassword",
  },
  {
    path: "/forget-password",
    element: <ResetPassword />,
    name: "ResetPassword",
  },
  {
    path: "/signup",
    element: <Signup />,
    name: "Signup",
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>,
    children: adminDashboardRoutes,
  },
];

/* ---------------------------------------------------------
FINAL EXPORTED ROUTE CONFIG
--------------------------------------------------------- */
export const routeConfig: RouteConfig[] = [...publicRoutes];
