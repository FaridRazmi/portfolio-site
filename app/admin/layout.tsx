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
      <main style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
