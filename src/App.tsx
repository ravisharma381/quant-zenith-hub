import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Games from "./pages/Games";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MLCourseDetail from "./pages/MLCourseDetail";
import MLCourseEnroll from "./pages/MLCourseEnroll";
import CourseLearn from "./pages/CourseLearn";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/problems" element={<Layout><Problems /></Layout>} />
            <Route path="/problems/:id" element={<Layout><ProblemDetail /></Layout>} />
            <Route path="/games" element={<Layout><Games /></Layout>} />
            <Route path="/courses" element={<Layout><Courses /></Layout>} />
            <Route path="/course/quant-interview-masterclass" element={<Layout><CourseDetail /></Layout>} />
            <Route path="/course/machine-learning-for-finance" element={<Layout><MLCourseDetail /></Layout>} />
            <Route path="/course/machine-learning-for-finance/enroll" element={<Layout><MLCourseEnroll /></Layout>} />
            <Route path="/course/:courseId/learn" element={<CourseLearn />} />
            <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
