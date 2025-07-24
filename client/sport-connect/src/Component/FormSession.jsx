import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";

export default function SessionForm({ type = "add" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_date: "",
    duration_hours: "",
    sport_id: "",
    provinsi_id: "",
    kabupaten_id: "",
    kecamatan_id: "",
  });

  const [sports, setSports] = useState([]);
  const [regions, setRegions] = useState({
    provinces: [],
    regencies: [],
    districts: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
    fetchSports();

    if (type === "edit" && id) {
      fetchSession(id);
    }
  }, [type, id]);

  const fetchSports = async () => {
    try {
      const { data } = await http.get("/sports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSports(data);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch sports" });
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await res.json();
      setRegions((prev) => ({ ...prev, provinces: data }));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch provinces" });
    }
  };

  const fetchRegencies = async (provinceId) => {
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      const data = await res.json();
      setRegions((prev) => ({ ...prev, regencies: data, districts: [] }));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch regencies" });
    }
  };

  const fetchDistricts = async (regencyId) => {
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
      );
      const data = await res.json();
      setRegions((prev) => ({ ...prev, districts: data }));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch districts" });
    }
  };

  const formatDateForInput = (isoDate) => {
    const dt = new Date(isoDate);
    const offset = dt.getTimezoneOffset();
    const local = new Date(dt.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const fetchSession = async (sessionId) => {
    try {
      const { data } = await http.get(`/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Session data", data);

      // pastikan dropdown dulu siap
      await fetchRegencies(data.provinsi_id);
      await fetchDistricts(data.kabupaten_id);

      setFormData({
        title: data.title,
        description: data.description,
        session_date: formatDateForInput(data.session_date),
        duration_hours: data.duration_hours,
        sport_id: data.sport_id,
        provinsi_id: data.provinsi_id,
        kabupaten_id: data.kabupaten_id,
        kecamatan_id: data.kecamatan_id,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch session data" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "provinsi_id") {
      fetchRegencies(value);
      setFormData((prev) => ({ ...prev, kabupaten_id: "", kecamatan_id: "" }));
    } else if (name === "kabupaten_id") {
      fetchDistricts(value);
      setFormData((prev) => ({ ...prev, kecamatan_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "edit") {
        await http.patch(`/sessions/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
      } else {
        await http.post("/sessions", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Session ${type === "edit" ? "updated" : "created"} successfully!`,
      }).then(() => navigate("/user"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          `Failed to ${type === "edit" ? "update" : "create"} session`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">{type === "edit" ? "Edit Session" : "Create New Session"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Sport */}
        <div className="mb-3">
          <label className="form-label">Sport</label>
          <select
            className="form-select"
            name="sport_id"
            value={formData.sport_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Session Date */}
        <div className="mb-3">
          <label className="form-label">Session Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="session_date"
            value={formData.session_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">Duration (hours)</label>
          <input
            type="number"
            className="form-control"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleChange}
            required
            min="0.5"
            step="0.5"
          />
        </div>

        {/* Province */}
        <div className="mb-3">
          <label className="form-label">Province</label>
          <select
            className="form-select"
            name="provinsi_id"
            value={formData.provinsi_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Province</option>
            {regions.provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regency */}
        <div className="mb-3">
          <label className="form-label">Regency/City</label>
          <select
            className="form-select"
            name="kabupaten_id"
            value={formData.kabupaten_id}
            onChange={handleChange}
            required
            disabled={!formData.provinsi_id}
          >
            <option value="">Select Regency/City</option>
            {regions.regencies.map((regency) => (
              <option key={regency.id} value={regency.id}>
                {regency.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="mb-3">
          <label className="form-label">District</label>
          <select
            className="form-select"
            name="kecamatan_id"
            value={formData.kecamatan_id}
            onChange={handleChange}
            required
            disabled={!formData.kabupaten_id}
          >
            <option value="">Select District</option>
            {regions.districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? `${type === "edit" ? "Updating..." : "Creating..."}`
            : `${type === "edit" ? "Update Session" : "Create Session"}`}
        </button>
      </form>
    </div>
  );
}
