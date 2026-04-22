export const metadata = {
  title: "Admin — Projects",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#333", fontFamily: "monospace" }}>404</p>
      </div>
    );
  }
  return <>{children}</>;
}
