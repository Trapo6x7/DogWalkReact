import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  text: string;
  group: string;
}

interface GroupCommentsProps {
  group: string;
  user: { username: string };
}

export default function GroupComments({ group, user }: GroupCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: user.username,
        text: newComment,
        group,
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="border rounded p-4 bg-white w-full h-50 overflow-scroll max-w-md">
      <h3 className="font-bold mb-2">Commentaires du groupe : {group}</h3>
      <div className="mb-2 max-h-40 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun commentaire.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="mb-1">
            <span className="font-semibold">{c.author} :</span>{" "}
            <span>{c.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Votre commentaire..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
}