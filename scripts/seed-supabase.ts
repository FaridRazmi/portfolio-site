/**
 * One-time seed script: pushes the bundled data/*.json content into Supabase.
 *
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (in .env.local or shell).
 *   2. Run:  npx tsx scripts/seed-supabase.ts
 *
 * Safe to re-run: upserts by id.
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// tsx/node don't auto-load Next.js .env.local — do it explicitly so the
// script works with the same env file the app uses.
try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function loadJson(file: string) {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", file), "utf-8"),
  );
}

const sections = [
  ["projects", loadJson("projects.json")],
  ["about", loadJson("about.json")],
  ["stats", loadJson("stats.json").stats],
  ["testimonials", loadJson("testimonials.json").testimonials],
  ["hero", loadJson("hero.json").overlays],
  ["contact", loadJson("contact.json")],
  ["siteConfig", loadJson("site-config.json")],
  ["comments", loadJson("comments.json").comments],
];

async function main() {
  for (const [id, data] of sections) {
    const { error } = await supabase.from("content").upsert(
      { id, data, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
    if (error) {
      console.error(`Failed to seed "${id}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`Seeded "${id}"`);
    }
  }
  if (!process.exitCode) console.log("Done. All sections seeded.");
}

main();
