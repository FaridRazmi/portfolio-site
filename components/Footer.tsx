import fs from "fs";
import path from "path";
import FooterClient from "@/components/FooterClient";
import { SiteConfig } from "@/components/admin/types";

export default function Footer() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "site-config.json"),
    "utf-8",
  );
  const config: SiteConfig = JSON.parse(raw);

  return (
    <FooterClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      tagline={config.footer.tagline}
      copyrightName={config.footer.copyrightName}
    />
  );
}
