import { useEffect, useState } from "react";
import http from "../lib/http";
import Swal from "sweetalert2";
import SessionCard from "../component/SessionCard";
import { useNavigate } from "react-router";

export default function SessionUpdate() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      const { data } = await http.get("/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      
      const token = localStorage.getItem("access_token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      
      const mySessions = data.filter((s) => s.host_id === userId);
      setSessions(mySessions);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data session milikmu", "error");
    }
  };

  const handleDelete = async (session) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus?",
      text: `Session "${session.title}" akan dihapus`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await http.delete(`/sessions/${session.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        Swal.fire("Terhapus!", "Session berhasil dihapus.", "success");
        fetchMySessions(); 
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal menghapus session", "error");
      }
    }
  };

  const handleEdit = (session) => {
    navigate(`/sessions/${session.id}/edit`);
  };

  return (
    <div className="container mt-4">
      <h2>Session Saya</h2>
      <div className="d-flex flex-wrap">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={() => handleEdit(session)}
              onDelete={() => handleDelete(session)}
              isOwner={true}
            />
          ))
        ) : (
          <p>Kamu belum memiliki session.</p>
        )}
      </div>
    </div>
  );
}
