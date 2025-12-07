import { useState } from "react";
import api from "../api/client";

export default function AccountantReceiversPage() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    bankAccount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/api/receivers", form);
      setMessage("수혜자가 등록되었습니다.");
      setForm({ name: "", type: "", bankAccount: "" });
    } catch (err) {
      console.error("CREATE RECEIVER ERROR:", err);
      setError("수혜자 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">수혜자 등록</h1>
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
          <div className="form-label">유형 (예: NGO, 개인 등)</div>
          <input
            className="form-input"
            name="type"
            value={form.type}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">계좌번호</div>
          <input
            className="form-input"
            name="bankAccount"
            value={form.bankAccount}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-muted">{message}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "등록 중..." : "수혜자 등록"}
        </button>
      </form>
    </div>
  );
}
