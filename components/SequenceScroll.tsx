import { getHeroOverlays } from "@/lib/data-store";
import SequenceScrollClient from "@/components/SequenceScrollClient";

export default function SequenceScroll() {
  const overlays = getHeroOverlays();
  return <SequenceScrollClient overlays={overlays} />;
}
