import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <main style={{ padding: '20px' }}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
