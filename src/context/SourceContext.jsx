import { createContext, useState } from "react";

export const SourceContext = createContext();

export function SourceProvider({ children }) {
  const [sources, setSources] = useState([]);

  return (
    <SourceContext.Provider
      value={{
        sources,
        setSources
      }}
    >
      {children}
    </SourceContext.Provider>
  );
}