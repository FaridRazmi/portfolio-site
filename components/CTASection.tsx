"use client";

import { useState, useEffect } from "react";
import CTASectionClient from "@/components/CTASectionClient";
import type { ContactData } from "@/components/admin/types";

export default function CTASection() {
  const [data, setData] = useState<ContactData | null>(null);

  useEffect(() => {
    fetch("/api/contact-config")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;
  return <CTASectionClient data={data} />;
}
