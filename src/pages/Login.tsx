import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form */}
      <div className="w-1/2 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Navigation */}
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Quantprof.org
            </Link>
          </div>

          {/* Sign In Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sign In
              </h1>
              <p className="text-muted-foreground">
                Connect your Google account or other provider to get started.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                <span className="mr-2 font-bold">G</span>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full h-12"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                <Github className="mr-2 h-5 w-5" />
                {isLoading ? "Signing in..." : "Sign in with GitHub"}
              </Button>
            </div>

            <div className="text-center">
              <span className="text-muted-foreground">
                Not registered yet? 
              </span>
              <Link 
                to="/signup"
                className="text-primary hover:underline ml-1"
              >
                Create an account.
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="w-1/2 bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center p-8">
        <div className="text-center text-white space-y-6">
          <h2 className="text-4xl font-bold">
            Welcome Back To Quantprof.org
          </h2>
          <p className="text-xl text-white/90">
            Sign into your account and get ready for your next interview!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;