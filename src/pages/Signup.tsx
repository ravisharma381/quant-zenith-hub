import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left Side - Sign Up Form */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-6 md:p-8">
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

          {/* Sign Up Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sign Up
              </h1>
              <p className="text-muted-foreground">
                Connect your Google account or other provider to get started.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <span className="mr-2 font-bold">G</span>
                {loading ? "Signing Up..." : "Sign Up with Google"}
              </Button>
            </div>

            <div className="text-center">
              <span className="text-muted-foreground">Already registered?</span>
              <Link to="/login" className="text-primary hover:underline ml-1">
                Sign In.
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center p-10 md:p-8 mt-8 md:mt-0">
        <div className="text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            You're One Step Away From Acing Your Next Interview.
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Create your account and start practicing!
          </p>
        </div>
      </div>

    </div>
  );

};

export default Signup;