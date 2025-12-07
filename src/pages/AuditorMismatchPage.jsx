import { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditorMismatchPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/audit/mismatch");
        setData(res.data);
      } catch (e) {
        console.error("LOAD MISMATCH ERROR:", e);
        setError("불일치 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="card">
      <h1 className="page-title">배분·지급 금액 불일치 조회</h1>
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
