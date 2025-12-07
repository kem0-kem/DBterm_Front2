import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setInitialLoading(true);
        setError("");
        // 백엔드에 GET /api/users/me가 없다면 여기서 404가 날 수 있음
        const res = await api.get("/api/users/me");
        if (res.data) {
          setForm({
            name: res.data.name ?? "",
            isAnonymous: !!res.data.isAnonymous,
          });
        }
      } catch (e) {
        // 없으면 그냥 조용히 무시
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.patch("/api/users/me", {
        name: form.name,
        isAnonymous: form.isAnonymous,
      });
      setMessage("프로필이 저장되었습니다.");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      setError("프로필을 저장하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">내 정보</h1>
      <p className="text-muted">현재 역할: {user.role}</p>
      {initialLoading ? (
        <p className="text-muted">불러오는 중...</p>
      ) : (
        <form className="form" onSubmit={submit}>
          <div>
            <div className="form-label">이름</div>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              후원 내역을 익명으로 표시
            </label>
          </div>
          {error && <p className="text-error">{error}</p>}
          {message && <p className="text-muted">{message}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </form>
      )}
    </div>
  );
}
