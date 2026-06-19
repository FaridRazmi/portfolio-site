import { getSiteConfig } from "@/lib/data-store";
import FooterClient from "@/components/FooterClient";

export default function Footer() {
  const config = getSiteConfig();
  return (
    <FooterClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      tagline={config.footer.tagline}
      copyrightName={config.footer.copyrightName}
    />
  );
}
