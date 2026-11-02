import { Outlet, useNavigate } from 'react-router-dom';

import { logout } from '../../api/adminAuthApi';
import AdminLogo from '../../components/admin/AdminLogo';
import '../../styles/admin/admin-common.css';
import '../../styles/admin/admin-layout.css';

// 관리자 대시보드: 왼쪽 사이드바(LOGO, 로그아웃) + 본문
function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <AdminLogo to="/admin/dashboard" />
        <button type="button" className="admin-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </aside>
      <main className="admin-layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
