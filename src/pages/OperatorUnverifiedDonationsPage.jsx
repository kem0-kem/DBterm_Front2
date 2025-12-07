import { useEffect, useState } from "react";
import api from "../api/client";

export default function OperatorUnverifiedDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/donations/unverified?date=today");
      setDonations(res.data || []);
    } catch (e) {
      console.error("LOAD UNVERIFIED ERROR:", e);
      setError("미검증 기부 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleVerify = async (donationId) => {
    try {
      setActionMessage("");
      await api.patch(`/api/donations/${donationId}/verify`);
      setActionMessage(`기부 ${donationId} 이(가) 검증되었습니다.`);
      await load();
    } catch (e) {
      console.error("VERIFY DONATION ERROR:", e);
      setError("기부 검증에 실패했습니다.");
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">미검증 기부 목록</h1>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {actionMessage && <p className="text-muted">{actionMessage}</p>}
      {!loading && donations.length === 0 && (
        <p className="text-muted">미검증 기부가 없습니다.</p>
      )}
      {!loading && donations.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>캠페인</th>
                <th>기부자</th>
                <th>금액</th>
                <th>일시</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.donationId || d.id}>
                  <td>{d.donationId ?? d.id}</td>
                  <td>{d.campaignTitle || "-"}</td>
                  <td>{d.donorName || d.donorId}</td>
                  <td>{d.amount?.toLocaleString?.() ?? d.amount}</td>
                  <td>{d.donatedAt}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleVerify(d.donationId ?? d.id)}
                    >
                      검증
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
