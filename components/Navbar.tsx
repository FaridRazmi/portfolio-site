import { getSiteConfig } from "@/lib/data-store";
import NavbarClient from "@/components/NavbarClient";

export default function Navbar() {
  const config = getSiteConfig();
  return (
    <NavbarClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      navLinks={config.navbar.links}
      socials={config.navbar.socials}
    />
  );
}
