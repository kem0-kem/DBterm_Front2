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
                <th>동작</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.auditId ?? log.audit_id}>
                  {/* 시간: event_time → eventTime 매핑도 대비 */}
                  <td>{log.eventTime ?? log.event_time ?? "-"}</td>

                  {/* 사용자: actor_user_id → actorUserId */}
                  <td>{log.actorUserId ?? log.actor_user_id ?? "-"}</td>

                  {/* 테이블: object_table → objectTable */}
                  <td>{log.objectTable ?? log.object_table ?? "-"}</td>

                  {/* 동작 */}
                  <td>{log.action}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}