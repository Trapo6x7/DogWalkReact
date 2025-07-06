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
    <div
      style={{
        backgroundColor: '#FBFFEE',
        borderRadius: '0.5rem',
        padding: '1rem',
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'var(--secondary-brown)', textAlign: 'center', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Commentaires
      </h3>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loading ? (
          <p style={{ color: '#888', fontSize: '0.875rem', textAlign: 'center' }}>Chargement…</p>
        ) : comments.length === 0 ? (
          <p style={{ color: '#888', fontSize: '0.875rem', textAlign: 'center' }}>Aucun commentaire.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} style={{ marginBottom: '0.25rem', background: 'rgba(123,78,46,0.05)', borderRadius: '0.375rem', padding: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--secondary-brown)' }}>{c.user.name ?? "?"} :</span>{' '}
              <span style={{ color: 'var(--secondary-brown)' }}>{c.content}</span>
            </div>
          ))
        )}
        {error && <p style={{ color: '#e53e3e', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
      </div>
      <form
        onSubmit={handleAddComment}
        style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(123, 78, 46, 0.1)', paddingTop: '0.75rem' }}
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Votre commentaire..."
          style={{
            flex: 1,
            border: '1px solid rgba(123, 78, 46, 0.2)',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            fontSize: '0.875rem',
            background: 'rgba(255,255,255,0.8)',
            outline: 'none',
            color: 'var(--secondary-brown)',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: 'var(--primary-green)',
            color: 'var(--primary-brown)',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.875rem',
            minWidth: 90,
          }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
