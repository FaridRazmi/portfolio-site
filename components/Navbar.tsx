"use client";

import { useState, useEffect } from "react";
import NavbarClient from "@/components/NavbarClient";
import type { SiteConfig } from "@/components/admin/types";

export default function Navbar() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  if (!config) return null;
  return (
    <NavbarClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      navLinks={config.navbar.links}
      socials={config.navbar.socials}
    />
  );
}
