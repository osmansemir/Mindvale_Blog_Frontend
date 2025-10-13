import Post from "./pages/Post";
import MarkdownEditor from "./pages/MarkdownEditor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ArticleProvider } from "./context/ArticleContext";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <ThemeProvider>
        <ArticleProvider>
          <Router>
            <Routes>
              <Route
                path="/articles/:slug"
                element={
                  <Layout>
                    <Post />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <Layout>
                    <Admin />
                  </Layout>
                }
              />
              <Route path="/admin/articles/new" element={<MarkdownEditor />} />
              <Route
                path="/admin/articles/edit/:id"
                element={<MarkdownEditor />}
              />
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
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
