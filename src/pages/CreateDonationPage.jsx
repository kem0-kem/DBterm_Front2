import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function CreateDonationPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    campaignId: "",
    amount: "",
    paymentMethod: "CARD",
  });
  const [loading, setLoading] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoadingCampaigns(true);
        const res = await api.get("/api/campaigns?status=active");
        const data = res.data?.content || res.data || [];
        setCampaigns(data);
      } catch (e) {
        console.error("LOAD CAMPAIGNS ERROR", e);
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const payload = {
        campaignId: form.campaignId ? Number(form.campaignId) : null,
        amount: form.amount ? Number(form.amount) : 0,
        paymentMethod: form.paymentMethod,
      };
      await api.post("/api/donations", payload);
      setMessage("후원이 등록되었습니다.");
      navigate("/donor/donations", { replace: true });
    } catch (err) {
      console.error("CREATE DONATION ERROR:", err);
      setError("후원 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">후원 등록</h1>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">캠페인</div>
          <select
            name="campaignId"
            className="form-input"
            value={form.campaignId}
            onChange={handleChange}
          >
            <option value="">캠페인을 선택하세요</option>
            {campaigns.map((c) => (
              <option key={c.campaignId || c.id} value={c.campaignId ?? c.id}>
                {c.title || c.name}
              </option>
            ))}
          </select>
          {loadingCampaigns && (
            <p className="text-muted" style={{ marginTop: 4 }}>
              캠페인 목록을 불러오는 중...
            </p>
          )}
        </div>
        <div>
          <div className="form-label">금액</div>
          <input
            type="number"
            name="amount"
            className="form-input"
            value={form.amount}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <div className="form-label">결제 수단</div>
          <select
            name="paymentMethod"
            className="form-input"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="CARD">카드</option>
            <option value="BANK_TRANSFER">계좌이체</option>
            <option value="CASH">현금</option>
          </select>
        </div>
        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-muted">{message}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "등록 중..." : "후원 등록"}
        </button>
      </form>
    </div>
  );
}
