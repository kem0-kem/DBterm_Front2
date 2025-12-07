import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function DonationTracePage() {
  const { donationId } = useParams();
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/donations/${donationId}/trace`);
        setTrace(res.data);
      } catch (e) {
        setError("후원금 사용처를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrace();
  }, [donationId]);

  return (
    <div className="card">
      <h1 className="page-title">후원금 사용처 추적</h1>
      <p className="text-muted">
        <Link to="/donor/donations">← 내 후원 내역으로 돌아가기</Link>
      </p>
      {loading && <p className="text-muted">불러오는 중...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && trace && (
        <pre
          style={{
            background: "#f9fafb",
            padding: 12,
            borderRadius: 6,
            overflowX: "auto",
            fontSize: "0.8rem",
          }}
        >
{JSON.stringify(trace, null, 2)}
        </pre>
      )}
    </div>
  );
}
