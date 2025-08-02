import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, LogIn, User, ChevronDown, BookOpen, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Problems", path: "/problems" },
    { name: "Games", path: "/games" },
    { name: "Blogs", path: "/blogs" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-foreground">QuantProf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Courses Dropdown - Hover based */}
            <div className="relative group">
              <span className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-default",
                (isActive("/courses") || isActive("/my-courses"))
                  ? "text-primary"
                  : "text-muted-foreground"
              )}>
                Courses
                <ChevronDown className="w-3 h-3" />
              </span>
              
              {/* Dropdown Content with screenshot styling */}
              <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-72 bg-card border border-border rounded-lg shadow-lg p-2">
                  <Link 
                    to="/my-courses" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                  >
                    <div className="mt-1">
                      <GraduationCap className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">My Courses</div>
                      <div className="text-sm text-muted-foreground">Continue your learning journey</div>
                    </div>
                  </Link>
                  <Link 
                    to="/courses" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                  >
                    <div className="mt-1">
                      <BookOpen className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">All Courses</div>
                      <div className="text-sm text-muted-foreground">Browse expert-led courses</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </Button>
            <Button variant="premium" size="sm" asChild>
              <Link to="/signup">
                <User className="w-4 h-4" />
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 text-base font-medium transition-colors hover:text-primary",
                    isActive(item.path)
                      ? "text-primary bg-gradient-accent"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Courses Section */}
              <div className="border-t border-border pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  Courses
                </div>
                <Link
                  to="/my-courses"
                  className={cn(
                    "block px-6 py-2 text-base font-medium transition-colors hover:text-primary",
                    isActive("/my-courses")
                      ? "text-primary bg-gradient-accent"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  My Courses
                </Link>
                <Link
                  to="/courses"
                  className={cn(
                    "block px-6 py-2 text-base font-medium transition-colors hover:text-primary",
                    isActive("/courses")
                      ? "text-primary bg-gradient-accent"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  All Courses
                </Link>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                </Button>
                <Button variant="premium" size="sm" className="w-full" asChild>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;