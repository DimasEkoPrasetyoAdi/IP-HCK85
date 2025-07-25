import { useEffect, useState } from "react";
import SideBar from "../Component/SideBar";
import SessionCard from "../Component/SessionCard";
import http from "../lib/http";
import Swal from "sweetalert2";

export default function UserPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await http.get("/sessions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (session) => {
    try {
      await http.post(
        `/participants`,
        { session_id: session.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        }
      );

      const aiRes = await http.patch(
        `/sessions/${session.id}/ai`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        }
      );

      const recommendation = aiRes.data.recommendation || "Tidak ada rekomendasi dari AI.";

      Swal.fire({
        icon: "success",
        title: `Berhasil join: ${session.title}`,
        html: `<strong>Rekomendasi AI:</strong><br/><em>${recommendation}</em>`,
        confirmButtonText: "OK",
      });

      fetchSessions()
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal join session",
        text: err.response?.data?.message || "Terjadi kesalahan.",
      });
    }
  };

  return (
    <div className="d-flex">
      <SideBar />
      <div className="flex-grow-1 p-4">
        <div className="container-fluid">
          <h3 className="mb-4 fw-bold">All Sessions</h3>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-clean mx-auto mb-3"></div>
              <p className="text-muted">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                <h4>No Sessions Available</h4>
                <p>Be the first to create a session!</p>
              </div>
            </div>
          ) : (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onJoin={handleJoinSession}
                  isOwner={session.host?.id === session.userId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
