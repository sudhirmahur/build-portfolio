import { createContext, useContext } from "react";

// true when a page component is rendered as a section of the portfolio home page
const EmbeddedContext = createContext(false);
export const EmbeddedProvider = EmbeddedContext.Provider;
export const useEmbedded = () => useContext(EmbeddedContext);
