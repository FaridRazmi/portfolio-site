"use client";

import { useState, useEffect } from "react";
import TestimonialsSectionClient from "@/components/TestimonialsSectionClient";
import type { TestimonialsData } from "@/components/admin/types";

export default function TestimonialsSection() {
  const [data, setData] = useState<TestimonialsData | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;
  return <TestimonialsSectionClient data={data} />;
}
