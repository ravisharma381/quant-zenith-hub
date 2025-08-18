import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, LogIn, User, ChevronDown, BookOpen, GraduationCap, LogOut, CreditCard, Gamepad2, FileText, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('mockLoggedIn') === 'true');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('mockLoggedIn');
    setIsLoggedIn(false);
  };

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
            <span className="text-lg font-bold text-foreground">QuantProf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
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
                "text-base font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-default",
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

          {/* Desktop Auth Buttons / User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                  </Avatar>
                </Button>
                
                {/* User Dropdown with courses styling */}
                <div className="absolute top-full right-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                      to="/billing" 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    >
                      <div className="mt-1">
                        <CreditCard className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Billing</div>
                        <div className="text-sm text-muted-foreground">View purchase history & details</div>
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item w-full text-left"
                    >
                      <div className="mt-1">
                        <LogOut className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Logout</div>
                        <div className="text-sm text-muted-foreground">Sign out of your account</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
            <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-lg p-2 mx-4 mb-4">
              {/* Main Navigation Items */}
              <Link 
                to="/problems" 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                onClick={() => setIsOpen(false)}
              >
                <div className="mt-1">
                  <Puzzle className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Problems</div>
                  <div className="text-sm text-muted-foreground">Practice problem solving</div>
                </div>
              </Link>
              
              <Link 
                to="/games" 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                onClick={() => setIsOpen(false)}
              >
                <div className="mt-1">
                  <Gamepad2 className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Games</div>
                  <div className="text-sm text-muted-foreground">Interactive challenges</div>
                </div>
              </Link>
              
              <Link 
                to="/blogs" 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                onClick={() => setIsOpen(false)}
              >
                <div className="mt-1">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Blogs</div>
                  <div className="text-sm text-muted-foreground">Read insights and tips</div>
                </div>
              </Link>
              
              <Link 
                to="/courses" 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                onClick={() => setIsOpen(false)}
              >
                <div className="mt-1">
                  <BookOpen className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">All Courses</div>
                  <div className="text-sm text-muted-foreground">Browse expert-led courses</div>
                </div>
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link 
                    to="/my-courses" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    onClick={() => setIsOpen(false)}
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
                    to="/billing" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="mt-1">
                      <CreditCard className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Billing</div>
                      <div className="text-sm text-muted-foreground">View purchase history & details</div>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item w-full text-left"
                  >
                    <div className="mt-1">
                      <LogOut className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Logout</div>
                      <div className="text-sm text-muted-foreground">Sign out of your account</div>
                    </div>
                  </button>
                </>
              )}
              
              {!isLoggedIn && (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="mt-1">
                      <LogIn className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Login</div>
                      <div className="text-sm text-muted-foreground">Sign in to your account</div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/signup" 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="mt-1">
                      <User className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Sign Up</div>
                      <div className="text-sm text-muted-foreground">Create your account</div>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;