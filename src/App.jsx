import Post from "./pages/Post";
import MarkdownEditor from "./pages/MarkdownEditor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ArticleProvider } from "./context/ArticleContext";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import MyArticles from "./pages/MyArticles";
import AdminReviewQueue from "./pages/AdminReviewQueue";
import UsersList from "./pages/admin/UsersList";
import UserDetail from "./pages/admin/UserDetail";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <ThemeProvider>
        <ArticleProvider>
          <Toaster position="top-right" richColors />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/articles/:slug"
                element={
                  <Layout>
                    <Post />
                  </Layout>
                }
              />

              {/* Authentication Routes - Only accessible to non-authenticated users */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Author/Admin Routes - My Articles */}
              <Route
                path="/my-articles"
                element={
                  <ProtectedRoute allowedRoles={["author", "admin"]}>
                    <Layout>
                      <MyArticles />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes - Admin only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes - Review Queue */}
              <Route
                path="/admin/review-queue"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <AdminReviewQueue />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes - User Management */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <UsersList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Layout>
                      <UserDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Author/Admin Routes - Article Creation */}
              <Route
                path="/admin/articles/new"
                element={
                  <ProtectedRoute allowedRoles={["author", "admin"]}>
                    <MarkdownEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["author", "admin"]}>
                    <MarkdownEditor />
                  </ProtectedRoute>
                }
              />

              {/* 404 Routes */}
              <Route
                path="/404"
                element={
                  <Layout>
                    <NotFound />
                  </Layout>
                }
              />
              <Route
                path="/*"
                element={
                  <Layout>
                    <NotFound />
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </ArticleProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
