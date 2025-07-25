import { useEffect, useState } from "react";
import http from "../lib/http";
import Swal from "sweetalert2";
import SessionCard from "../Component/SessionCard";
import SideBar from "../Component/SideBar";
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
    <div className="d-flex min-vh-100">
      <SideBar />
      <div className="flex-grow-1 p-4">
        <div className="container-fluid">
          <h2 className="mb-4 fw-bold">Session Saya</h2>

          {sessions.length > 0 ? (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEdit={() => handleEdit(session)}
                  onDelete={() => handleDelete(session)}
                  isOwner={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="text-muted">
                <i className="bi bi-calendar-plus display-4 text-muted mb-3"></i>
                <h4>Kamu belum memiliki session</h4>
                <p>Mulai buat session pertamamu!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
