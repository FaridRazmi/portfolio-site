import fs from "fs";
import path from "path";
import TestimonialsSectionClient from "@/components/TestimonialsSectionClient";
import { TestimonialsData } from "@/components/admin/types";

export default function TestimonialsSection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "testimonials.json"),
    "utf-8",
  );
  const data: TestimonialsData = JSON.parse(raw);

  return <TestimonialsSectionClient data={data} />;
}
