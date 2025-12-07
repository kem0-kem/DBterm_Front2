import { useState } from "react";
import api from "../api/client";

export default function OperatorApproveAllocationsPage() {
  const [rawIds, setRawIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const allocationIds = rawIds
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));

      await api.post("/api/allocations/approve", { allocationIds });
      setMessage("배분안이 승인되었습니다.");
    } catch (err) {
      console.error("APPROVE ALLOCATIONS ERROR:", err);
      setError("배분안 승인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">배분안 승인</h1>
      <p className="text-muted">
        자동 생성된 Allocation ID들을 쉼표로 구분하여 입력한 후 승인할 수 있습니다.
      </p>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">Allocation ID 목록 (쉼표로 구분)</div>
          <textarea
            className="form-input"
            rows={3}
            value={rawIds}
            onChange={(e) => setRawIds(e.target.value)}
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
          {loading ? "승인 중..." : "배분안 승인"}
        </button>
      </form>
    </div>
  );
}
