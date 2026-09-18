import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Farid Razmi",
  description: "Terms of use for reidworks.my and the personal tools operated with it.",
};

const page: CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: "132px 24px 96px",
  fontFamily: "var(--font-body)",
  color: "var(--fg)",
  lineHeight: 1.75,
};

const h1: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "clamp(2rem, 5vw, 3rem)",
  lineHeight: 1.1,
  marginBottom: 8,
  letterSpacing: "-0.02em",
};

const meta: CSSProperties = {
  color: "var(--muted)",
  fontSize: 14,
  marginBottom: 40,
};

const h2: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 20,
  marginTop: 40,
  marginBottom: 10,
  color: "var(--accent)",
};

const p: CSSProperties = { marginBottom: 14, color: "var(--fg)", opacity: 0.88 };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={page}>
        <h1 style={h1}>Terms of Service</h1>
        <p style={meta}>Last updated: 18 September 2026</p>

        <p style={p}>
          These terms apply to reidworks.my and to any personal tool or automation operated
          by Farid Razmi that is connected to this site. By using this site, you agree to
          these terms.
        </p>

        <h2 style={h2}>1. Purpose</h2>
        <p style={p}>
          reidworks.my is a personal portfolio and engineering site. Some automation tools
          connected to it are private utilities built for the owner&apos;s own use and are
          not offered as a public service.
        </p>

        <h2 style={h2}>2. Acceptable use</h2>
        <p style={p}>
          You agree not to misuse this site: not to attempt unauthorised access, not to
          disrupt its operation, and not to use it for unlawful activity.
        </p>

        <h2 style={h2}>3. Content and intellectual property</h2>
        <p style={p}>
          The text, designs and code shown on this site belong to Farid Razmi unless stated
          otherwise. You may link to this site freely. Republishing substantial parts of it
          as your own work is not permitted.
        </p>

        <h2 style={h2}>4. Third-party services and links</h2>
        <p style={p}>
          This site may link to third-party websites, including affiliate links, and may
          use third-party services such as hosting and social platforms. Those services have
          their own terms and privacy policies, and we are not responsible for their
          content or practices. Where affiliate links are used, the owner may earn a
          commission from qualifying purchases at no extra cost to you.
        </p>

        <h2 style={h2}>5. No warranty</h2>
        <p style={p}>
          This site is provided &quot;as is&quot; and &quot;as available&quot;, without
          warranties of any kind, whether express or implied. Information published here is
          for general interest and may contain mistakes or become out of date.
        </p>

        <h2 style={h2}>6. Limitation of liability</h2>
        <p style={p}>
          To the fullest extent permitted by law, Farid Razmi is not liable for any loss or
          damage arising from your use of this site or from reliance on its content,
          including decisions made from information published here.
        </p>

        <h2 style={h2}>7. Changes</h2>
        <p style={p}>
          These terms may be updated from time to time. The version published on this page
          is the current one, and continued use of the site means you accept the updated
          terms.
        </p>

        <h2 style={h2}>8. Governing law and contact</h2>
        <p style={p}>
          These terms are governed by the laws of Malaysia. Any question about them can be
          sent to{" "}
          <a href="mailto:faridrazmi30@gmail.com" style={{ color: "var(--accent-2)" }}>
            faridrazmi30@gmail.com
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
