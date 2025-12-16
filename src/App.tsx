import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Games from "./pages/Games";
import ArithmeticPro from "./pages/ArithmeticPro";
import SequencesPro from "./pages/SequencesPro";
import SequencesSetup from "./pages/SequencesSetup";
import Optiver80 from "./pages/Optiver80";
import Sokoban from "./pages/Sokoban";
import ProbabilityMaster from "./pages/ProbabilityMaster";
import MemorySequences from "./pages/MemorySequences";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MLCourseDetail from "./pages/MLCourseDetail";
import MLCourseEnroll from "./pages/MLCourseEnroll";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Playlists from "./pages/Playlists";
import CompanyPlaylist from "./pages/CompanyPlaylist";
import Layout from "./components/Layout";
import ProtectedRoute from "./pages/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import AdminCourses from "./pages/Admin/AdminCourses";
import AdminRoute from "./pages/Admin/AdminRoute";
import SuperAdminRoute from "./pages/Admin/SuperAdminRoute";
import AdminTopics from "./pages/Admin/Chapters/Topics/Topics";
import AdminBuilder from "./pages/Admin/Chapters/Topics/Builder";
import AdminPlaylists from "./pages/Admin/Playlists/AdminPlaylists";
import AdminChapters from "./pages/Admin/Chapters/Chapters";
import CourseLearn from "./pages/CourseLearn";
import ScrollToTop from "./components/ScrollToTop";
import ContactUs from "./Contact";
import Premium from "./pages/Premium";
import AdminPricing from "./pages/Admin/AdminPricing";
import PremiumCheckout from "./pages/PremiumCheckout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PaypalSuccess from "./pages/PaypalSuccess";

const App = () => (
  <HelmetProvider>
    <AuthProvider>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/problems" element={<Layout><Problems /></Layout>} />
              <Route path="/problems/:id" element={<Layout><ProblemDetail /></Layout>} />
              <Route path="/games" element={<Layout><Games /></Layout>} />
              <Route path="/games/arithmetic-pro" element={<Layout><ArithmeticPro /></Layout>} />
              <Route path="/games/sequences-pro/setup" element={<Layout><SequencesSetup /></Layout>} />
              <Route path="/games/sequences-pro" element={<Layout><SequencesPro /></Layout>} />
              <Route path="/games/optiver-80" element={<Layout><Optiver80 /></Layout>} />
              <Route path="/games/sokoban" element={<Layout><Sokoban /></Layout>} />
              <Route path="/games/probability-master" element={<Layout><ProbabilityMaster /></Layout>} />
              <Route path="/games/memory-sequences" element={<Layout><MemorySequences /></Layout>} />
              <Route path="/courses" element={<Layout><Courses /></Layout>} />
              <Route path="/course/quant-interview-masterclass" element={<Layout><CourseDetail /></Layout>} />
              <Route path="/premium" element={<Layout><Premium /></Layout>} />
              <Route path="/checkout" element={
                <Layout>
                  <ProtectedRoute>
                    <PremiumCheckout />
                  </ProtectedRoute>
                </Layout>}
              />
              <Route path="/admin"
                element={
                  <Layout>
                    <SuperAdminRoute>
                      <AdminDashboard />
                    </SuperAdminRoute>
                  </Layout>}
              />
              <Route path="/admin/courses"
                element={
                  <Layout>
                    <AdminRoute>
                      <AdminCourses />
                    </AdminRoute>
                  </Layout>}
              />
              <Route path="/admin/builder"
                element={
                  <Layout>
                    <AdminRoute>
                      <AdminBuilder />
                    </AdminRoute>
                  </Layout>}
              />
              <Route path="/admin/pricing"
                element={
                  <Layout>
                    <SuperAdminRoute>
                      <AdminPricing />
                    </SuperAdminRoute>
                  </Layout>}
              />
              <Route path="/admin/courses/:courseId"
                element={
                  <Layout>
                    <AdminRoute>
                      <AdminChapters />
                    </AdminRoute>
                  </Layout>}
              />
              <Route path="/admin/course/:courseId/playlists"
                element={
                  <Layout>
                    <AdminRoute>
                      <AdminPlaylists />
                    </AdminRoute>
                  </Layout>}
              />
              <Route path="/admin/course/:courseId/chapter/:chapterId/topics"
                element={
                  <Layout>
                    <AdminRoute>
                      <AdminTopics />
                    </AdminRoute>
                  </Layout>}
              />
              <Route path="/course/:courseId/learn/:topicId?/playlist?/:playlistId?" element={
                <ProtectedRoute>
                  <CourseLearn />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <Layout>
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/contact" element={
                <Layout>
                  <ContactUs />
                </Layout>
              } />
              <Route path="/paypal/success" element={<PaypalSuccess />} />
              <Route path="/course/machine-learning-for-finance" element={<Layout><MLCourseDetail /></Layout>} />
              <Route path="/course/machine-learning-for-finance/enroll" element={<Layout><MLCourseEnroll /></Layout>} />
              <Route path="/playlists" element={<Layout><Playlists /></Layout>} />
              <Route path="/playlists/:companyId" element={<Layout><CompanyPlaylist /></Layout>} />
              {/* <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
              <Route path="/blogs/:slug" element={<Layout><BlogDetail /></Layout>} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </HelmetProvider>
);

export default App;
