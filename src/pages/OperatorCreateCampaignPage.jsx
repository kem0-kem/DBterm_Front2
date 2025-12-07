import { useState } from "react";
import api from "../api/client";

export default function OperatorCreateCampaignPage() {
  const [form, setForm] = useState({
    title: "",
    department: "",
    goalAmount: "",
    description: "",
    startDate: "",
    endDate: "",
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
      const payload = {
        title: form.title,
        department: form.department,
        goalAmount: form.goalAmount ? Number(form.goalAmount) : 0,
        description: form.description,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      await api.post("/api/campaigns", payload);
      setMessage("캠페인이 생성되었습니다.");
    } catch (err) {
      console.error("CREATE CAMPAIGN ERROR:", err);
      setError("캠페인 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">캠페인 생성</h1>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">캠페인 제목</div>
          <input
            className="form-input"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">부서</div>
          <input
            className="form-input"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">목표 금액</div>
          <input
            type="number"
            className="form-input"
            name="goalAmount"
            value={form.goalAmount}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <div className="form-label">설명</div>
          <textarea
            className="form-input"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div>
          <div className="form-label">시작일</div>
          <input
            type="date"
            className="form-input"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">종료일</div>
          <input
            type="date"
            className="form-input"
            name="endDate"
            value={form.endDate}
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
          {loading ? "생성 중..." : "캠페인 생성"}
        </button>
      </form>
    </div>
  );
}
