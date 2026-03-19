import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Formations from "./pages/Formations";
import FormationDetail from "./pages/FormationDetail";
import InternationalServices from "./pages/InternationalServices";
import Partenaires from "./pages/Partenaires";
import news from "./pages/news";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminInternationalRequests from "./pages/admin/AdminInternationalRequests";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import IELTSPreparation from "./pages/IELTSPreparation";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "formations", Component: Formations },
      { path: "formations/:id", Component: FormationDetail },
      { path: "services-internationaux", Component: InternationalServices },
      { path: "Partenaires", Component: Partenaires },
      { path: "contact", Component: Contact },
      { path: "news", Component: news },
      { path: "news/:id", Component: NewsDetail },
      { path: "login", Component: Login },
      { path: "change-password", Component: ChangePassword },
      { path: "student", Component: StudentDashboard },
      { path: "teacher", Component: TeacherDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/news", Component: AdminNews },
      { path: "admin/international-requests", Component: AdminInternationalRequests },
      { path: "admin/contact-messages", Component: AdminContactMessages },
      { path: "ielts-preparation", Component: IELTSPreparation },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
