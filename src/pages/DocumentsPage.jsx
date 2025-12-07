import { useState } from "react";
import api from "../api/client";

export default function DocumentsPage() {
  const [form, setForm] = useState({
    disbursementId: "",
    storagePath: "",
    fileHash: "",
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
        disbursementId: form.disbursementId
          ? Number(form.disbursementId)
          : null,
        storagePath: form.storagePath,
        fileHash: form.fileHash,
      };
      await api.post("/api/documents", payload);
      setMessage("증빙 문서 메타데이터가 저장되었습니다.");
      setForm({ disbursementId: "", storagePath: "", fileHash: "" });
    } catch (err) {
      console.error("CREATE DOCUMENT ERROR:", err);
      setError("증빙 문서 메타데이터 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="page-title">증빙 문서 메타데이터</h1>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">Disbursement ID</div>
          <input
            className="form-input"
            name="disbursementId"
            value={form.disbursementId}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">저장 경로 (예: /s3/receipts/...)</div>
          <input
            className="form-input"
            name="storagePath"
            value={form.storagePath}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="form-label">파일 해시</div>
          <input
            className="form-input"
            name="fileHash"
            value={form.fileHash}
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
          {loading ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
