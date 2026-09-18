import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Farid Razmi",
  description:
    "How reidworks.my handles data, including Google API data accessed by personal automation tools.",
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
const ul: CSSProperties = { margin: "0 0 16px 20px", opacity: 0.88 };
const li: CSSProperties = { marginBottom: 8 };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={page}>
        <h1 style={h1}>Privacy Policy</h1>
        <p style={meta}>Last updated: 18 September 2026</p>

        <p style={p}>
          This policy explains how reidworks.my (the personal website of Farid Razmi,
          Malaysia) handles information, including data accessed through Google APIs by the
          personal automation tools described below.
        </p>

        <h2 style={h2}>1. Who we are</h2>
        <p style={p}>
          reidworks.my is a personal portfolio and engineering site. It is operated by
          Farid Razmi. Questions about this policy can be sent to{" "}
          <a href="mailto:faridrazmi30@gmail.com" style={{ color: "var(--accent-2)" }}>
            faridrazmi30@gmail.com
          </a>
          .
        </p>

        <h2 style={h2}>2. Information you provide</h2>
        <p style={p}>
          If you contact us or leave a comment, the information you submit (such as your
          name, message, and any email address you include) is used only to display your
          comment or to reply to you. We do not sell this information.
        </p>
        <p style={p}>
          This site does not use advertising cookies or sell visitor data. The site is
          hosted by Vercel, which may process standard server logs (such as IP address and
          browser type) for security and performance purposes.
        </p>

        <h2 style={h2}>3. Google user data accessed by our tools</h2>
        <p style={p}>
          Farid Razmi operates personal automation tools that use Google APIs. These tools
          access <strong>only the Google account of the site owner</strong>, and only after
          the owner grants consent on Google&apos;s own consent screen. No other
          person&apos;s Google data is accessed.
        </p>
        <p style={p}>The Google API scopes requested are:</p>
        <ul style={ul}>
          <li style={li}>
            <code>https://www.googleapis.com/auth/spreadsheets</code> — read and update
            rows in the owner&apos;s own Google Sheets, used as a personal content queue.
          </li>
        </ul>
        <p style={p}>
          The data accessed is limited to spreadsheet content the owner has authorised: for
          example product names, affiliate links, and a status column used to record whether
          a post has been published. This data is used solely to read the queue and write
          back publication status.
        </p>

        <h2 style={h2}>4. Limited Use disclosure</h2>
        <p style={p}>
          reidworks.my&apos;s use of information received from Google APIs will adhere to
          the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent-2)" }}
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Google user data is not used for
          advertising, is not sold, and is not used to train artificial intelligence models.
        </p>

        <h2 style={h2}>5. Where the data is stored</h2>
        <p style={p}>
          OAuth credentials and access tokens are stored locally on the owner&apos;s own
          device. They are not stored on, or transmitted to, any server operated by
          reidworks.my. Content that the owner chooses to publish is sent to the social
          platform the owner connects (for example Threads), through that platform&apos;s own
          API and under its own privacy policy.
        </p>

        <h2 style={h2}>6. Retention and deletion</h2>
        <p style={p}>
          Stored credentials can be deleted at any time from the owner&apos;s device.
          Access can also be revoked at any moment from the Google Account
          &quot;Third-party apps and services&quot; page (
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent-2)" }}
          >
            myaccount.google.com/permissions
          </a>
          ). Revoking access immediately stops all further access to Google data.
        </p>

        <h2 style={h2}>7. Changes to this policy</h2>
        <p style={p}>
          This policy may be updated when the tools or their data handling change. The
          &quot;Last updated&quot; date at the top of this page always reflects the current
          version.
        </p>
      </main>
      <Footer />
    </>
  );
}
