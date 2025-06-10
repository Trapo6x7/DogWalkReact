import { useState, useEffect } from "react";

interface Comment {
  id: number;
  user: { name: string };
  content: string;
  group: string;
}

interface GroupCommentsProps {
  group: { id: number }; // group id or iri
  user: { username: string };
}

export default function GroupComments({ group, user }: GroupCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les commentaires du backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(
      `${import.meta.env.VITE_API_URL}/api/comments?group=/api/groups/${
        group.id
      }`
    )
      .then((res) => res.json())
      .then((data) => setComments(data.member || data["hydra:member"] || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [group.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setError(null);
    const commentToSend = {
      content: newComment,
      group: `/api/groups/${group.id}`,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          ...(localStorage.getItem("authToken") && {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }),
        },
        body: JSON.stringify(commentToSend),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      const saved = await res.json();
      setComments([...comments, saved]);
      setNewComment("");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    }
  };

  return (
    <div className="border rounded p-4 bg-white w-full h-50 overflow-hidden max-w-md">
      <h3 className="font-bold mb-2 text-center">Commentaires</h3>
      <div className="mb-2 max-h-30 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement…</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun commentaire.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="mb-1">
              <span className="font-semibold">{c.user.name ?? "?"} :</span>{" "}
              <span>{c.content}</span>
            </div>
          ))
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    <form
      onSubmit={handleAddComment}
      className="flex gap-2 border-t bg-white sticky bottom-0 left-0"
      style={{ zIndex: 10 }}
    >
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Votre commentaire..."
        className="flex-1 border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Envoyer
      </button>
    </form>
    </div>
  );
}
