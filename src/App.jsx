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
import DashboardLayout from "./components/layout/DashboardLayout";

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

              {/* Authentication Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/sign-in" element={<Login />} />
                <Route path="/sign-up" element={<Register />} />
              </Route>

              {/* Protected Author/Admin Routes */}
              <Route
                element={<ProtectedRoute allowedRoles={["author", "admin"]} />}
              >
                <Route
                  path="/articles/my-articles"
                  element={
                    <Layout>
                      <MyArticles />
                    </Layout>
                  }
                />
                <Route path="/articles/new" element={<MarkdownEditor />} />
                <Route path="/articles/edit/:id" element={<MarkdownEditor />} />
              </Route>

              {/* Protected Admin Routes  */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route
                  path="/admin/dashboard"
                  element={
                    <DashboardLayout>
                      <Admin />
                    </DashboardLayout>
                  }
                />

                <Route
                  path="/admin/review-queue"
                  element={
                    <Layout>
                      <AdminReviewQueue />
                    </Layout>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <Layout>
                      <UsersList />
                    </Layout>
                  }
                />

                <Route
                  path="/admin/users/:id"
                  element={
                    <Layout>
                      <UserDetail />
                    </Layout>
                  }
                />
              </Route>

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
