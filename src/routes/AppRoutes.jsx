import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageGate from "./PageGate";
import { Spinner } from "../components/DataState";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import About from "../pages/About";
import Experience from "../pages/Experience";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import Education from "../pages/Education";
import Contact from "../pages/Contact";
import CustomPage from "../pages/CustomPage";
import NotFound from "../pages/NotFound";
import { useSite } from "../context/SiteContext";

// The admin panel is loaded only when /admin is opened.
const AdminRoutes = lazy(() => import("../admin/AdminRoutes"));

const gated = (slug, element) => <PageGate slug={slug}>{element}</PageGate>;

function PortfolioNotFound() {
  const { base } = useSite();
  return <NotFound home={base} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <AdminRoutes />
          </Suspense>
        }
      />

      {/* every portfolio lives under /p/<its-url-name> */}
      <Route path="/p/:slug" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={gated("about", <About />)} />
        <Route path="experience" element={gated("experience", <Experience />)} />
        <Route path="skills" element={gated("skills", <Skills />)} />
        <Route path="projects" element={gated("projects", <Projects />)} />
        <Route path="education" element={gated("education", <Education />)} />
        <Route path="contact" element={gated("contact", <Contact />)} />
        {/* pages created from the admin panel */}
        <Route path=":pageSlug" element={<CustomPage />} />
        <Route path="*" element={<PortfolioNotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
