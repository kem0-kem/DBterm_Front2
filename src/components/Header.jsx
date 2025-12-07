import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePathForRole } from "../utils/roleRoutes";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogoClick = () => {
    navigate(getHomePathForRole(user.role), { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const links = [];

  if (user.role === "DONOR") {
    links.push({ to: "/donor/donations", label: "내 후원 내역" });
    links.push({ to: "/donor/donate", label: "후원하기" });
  }
  if (user.role === "OPERATOR" || user.role === "ADMIN") {
    links.push({ to: "/operator/campaigns", label: "캠페인 목록" });
    links.push({ to: "/operator/campaigns/new", label: "캠페인 생성" });
    links.push({ to: "/operator/donations/unverified", label: "미검증 기부" });
    links.push({ to: "/operator/allocations/approve", label: "배분안 승인" });
  }
  if (user.role === "ACCOUNTANT" || user.role === "ADMIN") {
    links.push({ to: "/accountant/allocations", label: "승인된 배분" });
    links.push({ to: "/accountant/receivers", label: "수혜자 등록" });
    links.push({ to: "/accountant/disbursements/new", label: "지급 등록" });
    links.push({ to: "/accountant/documents", label: "증빙 문서" });
  }
  if (user.role === "AUDITOR" || user.role === "ADMIN") {
    links.push({ to: "/auditor/logs", label: "감사 로그" });
    links.push({ to: "/auditor/mismatch", label: "불일치 조회" });
    links.push({ to: "/auditor/doc-hashes", label: "문서 해시" });
  }

  return (
    <header className="app-header">
      <div className="app-header-logo" onClick={handleLogoClick}>
        DBterm
      </div>
      <nav className="app-header-nav">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="app-header-link">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="app-header-right">
        <Link to="/me" className="app-header-link">
          내 정보
        </Link>
        <span className="text-muted" style={{ color: "#e5e7eb" }}>
          {user.role}
        </span>
        <button className="btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
