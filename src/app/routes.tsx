import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PatientDashboard } from "./pages/PatientDashboard";
import { DoctorsPage } from "./pages/DoctorsPage";
import { BookAppointmentPage } from "./pages/BookAppointmentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/patient",
    Component: PatientDashboard,
  },
  {
    path: "/doctors",
    Component: DoctorsPage,
  },
  {
    path: "/book-appointment",
    Component: BookAppointmentPage,
  },
]);
