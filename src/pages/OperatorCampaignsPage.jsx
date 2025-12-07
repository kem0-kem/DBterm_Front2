import { useEffect, useState } from "react";
import api from "../api/client";

export default function OperatorCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/campaigns");
        setCampaigns(res.data?.content || res.data || []);
      } catch (e) {
        setError("캠페인 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="card">
      <h1 className="page-title">캠페인 목록</h1>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && campaigns.length === 0 && (
        <p className="text-muted">등록된 캠페인이 없습니다.</p>
      )}
      {!loading && campaigns.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>목표 금액</th>
                <th>기간</th>
                <th>부서</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.campaignId || c.id}>
                  <td>{c.campaignId ?? c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.goalAmount?.toLocaleString?.() ?? c.goalAmount}</td>
                  <td>
                    {c.startDate} ~ {c.endDate}
                  </td>
                  <td>{c.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
