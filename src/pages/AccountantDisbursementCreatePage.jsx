import { useState } from "react";
import api from "../api/client";

export default function AccountantDisbursementCreatePage() {
  const [form, setForm] = useState({
    allocationId: "",
    amount: "",
    paymentTxRef: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
        allocationId: form.allocationId ? Number(form.allocationId) : null,
        amount: form.amount ? Number(form.amount) : 0,
        paymentTxRef: form.paymentTxRef,
      };
      await api.post("/api/disbursements", payload);
      setMessage("지급 내역이 등록되었습니다.");
      setForm({ allocationId: "", amount: "", paymentTxRef: "" });
    } catch (err) {
      console.error("CREATE DISBURSEMENT ERROR:", err);
      setError("지급 내역 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">지급 내역 등록</h1>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">Allocation ID</div>
          <input
            className="form-input"
            name="allocationId"
            value={form.allocationId}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">금액</div>
          <input
            type="number"
            className="form-input"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <div className="form-label">지급 거래 참조 (예: 은행 거래번호)</div>
          <input
            className="form-input"
            name="paymentTxRef"
            value={form.paymentTxRef}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-muted">{message}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "등록 중..." : "지급 등록"}
        </button>
      </form>
    </div>
  );
}
