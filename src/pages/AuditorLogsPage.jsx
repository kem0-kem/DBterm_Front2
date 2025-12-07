import { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditorLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/audit/logs");
        setLogs(res.data?.content || res.data || []);
      } catch (e) {
        setError("감사 로그를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="card">
      <h1 className="page-title">감사 로그</h1>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && logs.length === 0 && (
        <p className="text-muted">표시할 감사 로그가 없습니다.</p>
      )}
      {!loading && logs.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>시간</th>
                <th>사용자</th>
                <th>테이블</th>
                <th>작업</th>
                <th>요약</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id || `${l.timestamp}-${l.userId}-${l.tableName}`}>
                  <td>{l.timestamp}</td>
                  <td>{l.username || l.userId}</td>
                  <td>{l.tableName}</td>
                  <td>{l.action}</td>
                  <td>{l.summary || l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
