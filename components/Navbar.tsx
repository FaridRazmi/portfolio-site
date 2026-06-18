import fs from "fs";
import path from "path";
import NavbarClient from "@/components/NavbarClient";
import { SiteConfig } from "@/components/admin/types";

export default function Navbar() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "site-config.json"),
    "utf-8",
  );
  const config: SiteConfig = JSON.parse(raw);

  return (
    <NavbarClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      navLinks={config.navbar.links}
      socials={config.navbar.socials}
    />
  );
}
