import { useNavigate } from 'react-router'

export default function SessionCard({
  session,
  onJoin,
  onEdit,
  onDelete,
  isOwner,
  requireLoginRedirect = false
}) {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    const token = localStorage.getItem("access_token");
    if (requireLoginRedirect && !token) {
      return navigate("/login");
    }
    onJoin?.(session);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const formattedDate = formatDate(session.session_date);

  return (
    <div className="card h-100">
      {/* Card Body */}
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-cyan fs-6 px-3 py-2">
            {session.Sport?.name || 'Sport'}
          </span>
          {session.ai_recommendation && (
            <i className="bi bi-robot text-cyan fs-5" title="AI Recommendation Available"></i>
          )}
        </div>

        <h5 className="card-title mb-3 fw-bold">{session.title}</h5>
        
        {/* Host Info */}
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-person-circle text-muted me-2 fs-5"></i>
          <small className="text-muted fw-medium">by {session.host?.name || "Unknown"}</small>
        </div>

        {/* Description */}
        {session.description && (
          <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {session.description?.length > 80 
              ? session.description.substring(0, 80) + '...' 
              : session.description}
          </p>
        )}

        {/* Details */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-calendar-event me-2 text-cyan"></i>
            <small className="fw-medium text-secondary">{formattedDate.date} at {formattedDate.time}</small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-clock me-2 text-cyan"></i>
            <small className="fw-medium text-secondary">{session.duration_hours} hours</small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-people me-2 text-cyan"></i>
            <small className="fw-medium text-secondary">
              {session.current_participants || 0}
              {session.max_participants && `/${session.max_participants}`} participants
            </small>
          </div>
        </div>

        {/* AI Recommendation for joined users */}
        {session.joined && session.ai_recommendation && (
          <div className="alert bg-cyan-light border-0 py-3 mb-3">
            <small className="text-cyan fw-medium">
              <i className="bi bi-robot me-1"></i>
              AI: {session.ai_recommendation.length > 80 
                ? session.ai_recommendation.substring(0, 80) + '...' 
                : session.ai_recommendation}
            </small>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        {isOwner ? (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-warning btn-sm flex-fill fw-medium"
              onClick={() => onEdit?.(session)}
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              <i className="bi bi-pencil me-1"></i>
              Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm flex-fill fw-medium"
              onClick={() => onDelete?.(session)}
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        ) : session.joined ? (
          <div className="text-center">
            <span className="badge bg-cyan py-2 px-4 fs-6 fw-medium">
              <i className="bi bi-check-circle me-1"></i>
              You're participating
            </span>
          </div>
        ) : (
          <button
            className="btn btn-cyan w-100 fw-medium py-2"
            onClick={handleJoinClick}
            disabled={session.max_participants && session.current_participants >= session.max_participants}
          >
            {requireLoginRedirect && !localStorage.getItem("access_token")
              ? <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login to Join
                </>
              : session.max_participants && session.current_participants >= session.max_participants
              ? <>
                  <i className="bi bi-x-circle me-2"></i>
                  Session Full
                </>
              : <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Join Session
                </>}
          </button>
        )}
      </div>
    </div>
  );
}
