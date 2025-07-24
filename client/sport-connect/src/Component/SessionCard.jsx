export default function SessionCard({ session, onJoin, onEdit, onDelete, isOwner }) {
  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{session.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Host: {session.host?.name || "unknown"}
        </h6>
        <p className="card-text">{session.description}</p>
        <p><strong>Tanggal:</strong> {new Date(session.session_date).toLocaleString()}</p>
        <p><strong>Peserta Saat Ini:</strong> {session.current_participants || 0}</p>

        {session.joined ? (
          <p>
            <strong>Rekomendasi AI:</strong><br />
            <em>{session.ai_recommendation || "Belum ada"}</em>
          </p>
        ) : (
          <p><em>Kamu belum join session ini</em></p>
        )}

        {isOwner ? (
          <>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => onEdit(session)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(session)}
            >
              Delete
            </button>
          </>
        ) : (
          !session.joined && (
            <button
              className="btn btn-primary"
              onClick={() => onJoin(session)}
            >
              Join
            </button>
          )
        )}
      </div>
    </div>
  );
}
