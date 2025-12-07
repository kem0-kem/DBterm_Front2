import { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditorDocumentHashesPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const query = dateFrom ? `?dateFrom=${dateFrom}` : "";
      const res = await api.get(`/api/documents/hashes${query}`);
      setData(res.data);
    } catch (err) {
      console.error("LOAD DOC HASHES ERROR:", err);
      setError("문서 해시 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 한번 로드 (dateFrom 없이)
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card">
      <h1 className="page-title">문서 해시 검증 목록</h1>
      <form className="form" onSubmit={load} style={{ marginBottom: 12 }}>
        <div style={{ maxWidth: 260 }}>
          <div className="form-label">시작일 (dateFrom)</div>
          <input
            type="date"
            className="form-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn"
          disabled={loading}
          style={{ marginTop: 4, width: "fit-content" }}
        >
          다시 조회
        </button>
      </form>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && data && (
        <pre
          style={{
            background: "#f9fafb",
            padding: 12,
            borderRadius: 6,
            overflowX: "auto",
            fontSize: "0.8rem",
          }}
        >
{JSON.stringify(data, null, 2)}
        </pre>
      )}
      {!loading && !data && !error && (
        <p className="text-muted">표시할 데이터가 없습니다.</p>
      )}
    </div>
  );
}
