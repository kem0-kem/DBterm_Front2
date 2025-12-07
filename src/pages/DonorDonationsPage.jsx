import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function DonorDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/donations/me");
        setDonations(res.data || []);
      } catch (e) {
        setError("후원 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleRowClick = (donationId) => {
    navigate(`/donor/donations/${donationId}/trace`);
  };

  return (
    <div className="card">
      <h1 className="page-title">내 후원 내역</h1>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && donations.length === 0 && (
        <p className="text-muted">후원 내역이 없습니다.</p>
      )}
      {!loading && donations.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>캠페인</th>
                <th>금액</th>
                <th>결제수단</th>
                <th>일시</th>
                <th>검증</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr
                  key={d.donationId || d.id}
                  onClick={() => handleRowClick(d.donationId || d.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{d.donationId ?? d.id}</td>
                  <td>{d.campaignTitle || d.campaignName || "-"}</td>
                  <td>{d.amount?.toLocaleString?.() ?? d.amount}</td>
                  <td>{d.paymentMethod || "-"}</td>
                  <td>{d.donatedAt || d.createdAt}</td>
                  <td>
                    {d.verified ? (
                      <span className="badge badge-success">검증됨</span>
                    ) : (
                      <span className="badge badge-warn">미검증</span>
                    )}
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
