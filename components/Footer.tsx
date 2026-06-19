"use client";

import { useState, useEffect } from "react";
import FooterClient from "@/components/FooterClient";
import type { SiteConfig } from "@/components/admin/types";

export default function Footer() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  if (!config) return null;
  return (
    <FooterClient
      brandName={config.brandName}
      brandSuffix={config.brandSuffix}
      tagline={config.footer.tagline}
      copyrightName={config.footer.copyrightName}
    />
  );
}
