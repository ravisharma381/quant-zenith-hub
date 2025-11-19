import React, { useState, useEffect, } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// const Login: React.FC = () => {
//   const { loginWithGoogle, loading, user } = useAuth();
//   const navigate = useNavigate();

//   // ✅ Redirect if user is already logged in
//   useEffect(() => {
//     if (user && !loading) {
//       navigate("/my-courses", { replace: true });
//     }
//   }, [user, loading, navigate]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
//       <button
//         onClick={async () => {
//           await loginWithGoogle();
//           navigate("/my-courses", { replace: true });
//         }}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Continue with Google
//       </button>
//     </div>
//   );
// };

const Login: React.FC = () => {
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
    // Simulate API call
    // setTimeout(() => {
    //   localStorage.setItem('mockLoggedIn', 'true');
    //   navigate('/');
    //   toast({
    //     title: "Welcome back!",
    //     description: "You have successfully signed in.",
    //   });
    // }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleGoogleSignIn();
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Quantprof.org
            </Link>
          </div>

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
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <span className="mr-2 font-bold">G</span>
                {loading ? "Signing in..." : "Sign in with Google"}
              </Button>

              <Button
                variant="secondary"
                className="w-full h-12"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Github className="mr-2 h-5 w-5" />
                {loading ? "Signing in..." : "Sign in with GitHub"}
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