"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { SiteConfig, NavLink, SocialLink } from "@/components/admin/types";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: type === "success" ? "#c8f135" : "#f74a4a",
        color: type === "success" ? "#000" : "#fff",
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        fontSize: "0.85rem",
        padding: "0.6rem 1.5rem",
        borderRadius: 100,
        zIndex: 999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      {msg}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0c0c0c",
  border: "1px solid #222",
  borderRadius: 6,
  padding: "0.5rem 0.75rem",
  color: "#e8e8e8",
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "#555",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/site-config");
    const json: SiteConfig = await res.json();
    setConfig(json);
  }, []);

  const onAuth = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateNavLink = (idx: number, field: keyof NavLink, val: string) => {
    if (!config) return;
    const newLinks = [...config.navbar.links];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    setConfig({ ...config, navbar: { ...config.navbar, links: newLinks } });
  };

  const updateSocial = (idx: number, field: keyof SocialLink, val: string) => {
    if (!config) return;
    const newSocials = [...config.navbar.socials];
    newSocials[idx] = { ...newSocials[idx], [field]: val };
    setConfig({ ...config, navbar: { ...config.navbar, socials: newSocials } });
  };

  const addNavLink = () => {
    if (!config) return;
    setConfig({
      ...config,
      navbar: {
        ...config.navbar,
        links: [...config.navbar.links, { label: "", href: "#" }],
      },
    });
  };

  const removeNavLink = (idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      navbar: {
        ...config.navbar,
        links: config.navbar.links.filter((_, i) => i !== idx),
      },
    });
  };

  const addSocial = () => {
    if (!config) return;
    setConfig({
      ...config,
      navbar: {
        ...config.navbar,
        socials: [...config.navbar.socials, { label: "", href: "https://" }],
      },
    });
  };

  const removeSocial = (idx: number) => {
    if (!config) return;
    setConfig({
      ...config,
      navbar: {
        ...config.navbar,
        socials: config.navbar.socials.filter((_, i) => i !== idx),
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/site-config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
    showToast("Site settings updated!");
    setSaving(false);
    router.refresh();
  };

  if (!config) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 800 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#e8e8e8",
          marginBottom: "2rem",
          letterSpacing: "-0.02em",
        }}
      >
        Site Settings
      </h2>

      {/* Brand */}
      <section
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #1e1e1e",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#c8f135",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          BRAND
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div>
            <label style={labelStyle}>Brand Name</label>
            <input
              style={inputStyle}
              value={config.brandName}
              onChange={(e) =>
                setConfig({ ...config, brandName: e.target.value })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Brand Suffix</label>
            <input
              style={inputStyle}
              value={config.brandSuffix}
              onChange={(e) =>
                setConfig({ ...config, brandSuffix: e.target.value })
              }
              placeholder="."
            />
          </div>
        </div>
      </section>

      {/* Navbar Links */}
      <section
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #1e1e1e",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#c8f135",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          NAVIGATION LINKS
        </h3>
        {config.navbar.links.map((link, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Label</label>
              <input
                style={inputStyle}
                value={link.label}
                onChange={(e) => updateNavLink(i, "label", e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Href</label>
              <input
                style={inputStyle}
                value={link.href}
                onChange={(e) => updateNavLink(i, "href", e.target.value)}
              />
            </div>
            {config.navbar.links.length > 1 && (
              <button
                onClick={() => removeNavLink(i)}
                style={{
                  background: "none",
                  border: "1px solid #222",
                  color: "#f74a4a",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNavLink}
          style={{
            background: "none",
            border: "1px dashed #333",
            color: "#c8f135",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontFamily: "var(--font-heading)",
          }}
        >
          + Add Link
        </button>
      </section>

      {/* Social Links */}
      <section
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #1e1e1e",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#c8f135",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          SOCIAL LINKS
        </h3>
        {config.navbar.socials.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Label</label>
              <input
                style={inputStyle}
                value={s.label}
                onChange={(e) => updateSocial(i, "label", e.target.value)}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>URL</label>
              <input
                style={inputStyle}
                value={s.href}
                onChange={(e) => updateSocial(i, "href", e.target.value)}
              />
            </div>
            {config.navbar.socials.length > 1 && (
              <button
                onClick={() => removeSocial(i)}
                style={{
                  background: "none",
                  border: "1px solid #222",
                  color: "#f74a4a",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addSocial}
          style={{
            background: "none",
            border: "1px dashed #333",
            color: "#c8f135",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontFamily: "var(--font-heading)",
          }}
        >
          + Add Social
        </button>
      </section>

      {/* Footer */}
      <section
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #1e1e1e",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#c8f135",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          FOOTER
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle}>Tagline</label>
            <input
              style={inputStyle}
              value={config.footer.tagline}
              onChange={(e) =>
                setConfig({
                  ...config,
                  footer: { ...config.footer, tagline: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Copyright Name</label>
            <input
              style={inputStyle}
              value={config.footer.copyrightName}
              onChange={(e) =>
                setConfig({
                  ...config,
                  footer: { ...config.footer, copyrightName: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #1e1e1e",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#c8f135",
            marginBottom: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          SEO METADATA
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div>
            <label style={labelStyle}>Page Title</label>
            <input
              style={inputStyle}
              value={config.seo.title}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
              value={config.seo.description}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, description: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Keywords (comma-separated)</label>
            <input
              style={inputStyle}
              value={config.seo.keywords.join(", ")}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: {
                    ...config.seo,
                    keywords: e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>OG Title</label>
            <input
              style={inputStyle}
              value={config.seo.ogTitle}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, ogTitle: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>OG Description</label>
            <input
              style={inputStyle}
              value={config.seo.ogDescription}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, ogDescription: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Theme Color</label>
            <input
              style={inputStyle}
              type="color"
              value={config.seo.themeColor}
              onChange={(e) =>
                setConfig({
                  ...config,
                  seo: { ...config.seo, themeColor: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: "#c8f135",
          color: "#000",
          border: "none",
          borderRadius: 8,
          padding: "0.75rem 2rem",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
