import { getTestimonials } from "@/lib/data-store";
import TestimonialsSectionClient from "@/components/TestimonialsSectionClient";

export default function TestimonialsSection() {
  const data = { testimonials: getTestimonials() };
  return <TestimonialsSectionClient data={data} />;
}
