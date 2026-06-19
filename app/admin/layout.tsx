import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — ReidTech",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0c0c",
        color: "#e8e8e8",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
      }}
    >
      <AdminSidebar />
      <style>{`
        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0 !important;
            padding-top: 60px;
            width: 100%;
          }
        }
        @media (min-width: 769px) {
          .admin-main {
            margin-left: 220px;
          }
        }
      `}</style>
      <main
        className="admin-main"
        style={{ flex: 1, minWidth: 0, padding: "2.5rem 1.5rem" }}
      >
        {children}
      </main>
    </div>
  );
}
