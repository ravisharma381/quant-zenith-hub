import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, LogIn, User, ChevronDown, BookOpen, GraduationCap, LogOut, CreditCard, Gamepad2, FileText, Puzzle, Mail, Crown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AvatarImage } from "@radix-ui/react-avatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout, userProfile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Signed out successfully 👋",
      description: "You have been signed out.",
    });
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

            <Link
              to="/courses"
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                isActive("/courses")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Courses
            </Link>

            <Link
              to="/contact"
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                isActive("/contact")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Contact
            </Link>

            <Link
              to="/premium"
              className={cn(
                "text-base font-medium transition-colors hover:text-purple-300",
                isActive("/premium")
                  ? "text-purple-400"
                  : "text-purple-400"
              )}
            >
              Premium
            </Link>
          </div>

          {/* Desktop Auth Buttons / User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin */}
            {['admin', 'superAdmin'].includes(userProfile?.role) && <div className="relative group">
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md 
             bg-cyan-900/20 text-cyan-300 border border-cyan-600/30
             hover:bg-cyan-900/40 hover:text-white hover:border-cyan-500
             transition-all duration-200 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium">Admin</span>
              </Link>
            </div>}
            {loading && (
              <div className="flex items-center gap-2">
                {/* Login button skeleton */}
                <div className="w-[70px] h-8 rounded-md bg-gray-700/40 animate-pulse" />

                {/* Signup button skeleton */}
                <div className="w-[80px] h-8 rounded-md bg-gray-700/40 animate-pulse" />
              </div>
            )}
            {user && !loading && (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                {/* Premium Crown */}
                {userProfile?.isPremium && (
                  <div className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </div>
                )}

                {/* User Dropdown with courses styling */}
                <div className="absolute top-full right-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="w-72 bg-card border border-border rounded-lg shadow-lg p-2">
                    {userProfile?.isPremium && (
                      <div className="flex items-center gap-2 p-3 mb-1 rounded-md bg-purple-500/10 text-purple-300">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-medium">Premium Member</span>
                      </div>
                    )}
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
                    <Link
                      to="/contact"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                    >
                      <div className="mt-1">
                        <Mail className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Contact Us</div>
                        <div className="text-sm text-muted-foreground">Get in touch with us</div>
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
            )}
            {
              !user && !loading && (
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
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="fixed top-16 left-0 right-0 z-50 md:hidden px-4 py-4">
              <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-lg p-2 mx-auto">
                {/* Main Navigation Items */}
                {userProfile?.isPremium && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 text-purple-300 mb-2">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Premium Member</span>
                  </div>
                )}
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

                {user && (
                  <>
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

                {!user && !loading && (
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
                <Link
                  to="/contact"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group/item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="mt-1">
                    <Mail className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Contact</div>
                    <div className="text-sm text-muted-foreground">Get in touch with us</div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;