import React, { useRef } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const ScrollContext = React.createContext<React.RefObject<HTMLDivElement> | null>(null);

const Layout = ({ children }: LayoutProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollContext.Provider value={scrollRef}>
      <div className="h-screen flex flex-col bg-gradient-dark">
        <Navigation />
        <main ref={scrollRef} className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </ScrollContext.Provider>
  );
};

export default Layout;