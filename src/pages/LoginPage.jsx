
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePathForRole } from "../utils/roleRoutes";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { role } = await login(username, password);
      const path = getHomePathForRole(role);
      navigate(path, { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="app-page">
      <div className="card" style={{ maxWidth: 400, margin: "40px auto" }}>
        <h1 className="page-title">로그인</h1>
        <form className="form" onSubmit={submit}>
          <div>
            <div className="form-label">아이디</div>
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <div className="form-label">비밀번호</div>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8 }}
          >
            로그인
          </button>
        </form>
        <p style={{ marginTop: 12, fontSize: "0.85rem" }}>
          아직 계정이 없다면{" "}
          <Link to="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
