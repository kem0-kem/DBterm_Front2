
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    phoneNum: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      setError("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="app-page">
      <div className="card" style={{ maxWidth: 400, margin: "40px auto" }}>
        <h1 className="page-title">회원가입</h1>
        <form className="form" onSubmit={submit}>
          <div>
            <div className="form-label">아이디</div>
            <input
              className="form-input"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="form-label">비밀번호</div>
            <input
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="form-label">이름</div>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="form-label">전화번호</div>
            <input
              className="form-input"
              name="phoneNum"
              value={form.phoneNum}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8 }}
          >
            회원가입
          </button>
        </form>
        <p style={{ marginTop: 12, fontSize: "0.85rem" }}>
          이미 계정이 있다면{" "}
          <Link to="/login">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
