import { Navigate } from "react-router-dom";
import { useSite } from "../context/SiteContext";

/** Redirect to the portfolio home when its owner has hidden this built-in page. */
export default function PageGate({ slug, children }) {
  const { isVisible, base } = useSite();
  return isVisible(slug) ? children : <Navigate to={base} replace />;
}
