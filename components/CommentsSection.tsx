import { getComments } from "@/lib/data-store";
import CommentsSectionClient from "@/components/CommentsSectionClient";

export default function CommentsSection() {
  const comments = getComments();
  return <CommentsSectionClient initialComments={comments} />;
}
