import Header from "./Header";
import Breadcrumb from "./Breadcrumb";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumb />
      {children}
    </div>
  );
}

export default Layout;
