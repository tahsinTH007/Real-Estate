import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main style={{ paddingTop: NAVBAR_HEIGHT }}>{children}</main>
    </div>
  );
};

export default Layout;
