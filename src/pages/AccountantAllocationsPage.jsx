
import { useEffect, useState } from "react";
import api from "../api/client";

export default function AccountantAllocationsPage() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/allocations/approved");
        setAllocations(res.data || []);
      } catch (e) {
        setError("승인된 배분 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllocations();
  }, []);

  return (
    <div className="card">
      <h1 className="page-title">승인된 배분 목록</h1>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && allocations.length === 0 && (
        <p className="text-muted">승인된 배분이 없습니다.</p>
      )}
      {!loading && allocations.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>캠페인</th>
                <th>수령인</th>
                <th>금액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.allocationId || a.id}>
                  <td>{a.allocationId ?? a.id}</td>
                  <td>{a.campaignTitle || "-"}</td>
                  <td>{a.receiverName || "-"}</td>
                  <td>{a.amount?.toLocaleString?.() ?? a.amount}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
