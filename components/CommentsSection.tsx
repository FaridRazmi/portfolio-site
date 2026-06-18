import fs from "fs";
import path from "path";
import CommentsSectionClient from "@/components/CommentsSectionClient";
import { CommentsData } from "@/components/admin/types";

export default function CommentsSection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "comments.json"),
    "utf-8",
  );
  const data: CommentsData = JSON.parse(raw);

  return <CommentsSectionClient initialComments={data.comments} />;
}
