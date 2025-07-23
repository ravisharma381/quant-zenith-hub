import React from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <main className="relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;