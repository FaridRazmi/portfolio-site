"use client";

import { useState, useEffect } from "react";
import CommentsSectionClient from "@/components/CommentsSectionClient";
import type { Comment } from "@/components/admin/types";

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[] | null>(null);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((d) => setComments(d.comments));
  }, []);

  if (!comments) return null;
  return <CommentsSectionClient initialComments={comments} />;
}
