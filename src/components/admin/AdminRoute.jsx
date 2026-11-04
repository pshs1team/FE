import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { isAdminLoggedIn } from '../../api/adminAuthApi';

// 관리자 로그인 여부 확인 (실제 권한 검증은 백엔드에서 토큰으로 처리해야 함)
function AdminRoute() {
  const location = useLocation();

  // 백엔드 연동 전 개발용: dev 모드에선 로그인 체크 건너뜀
  if (import.meta.env.DEV) return <Outlet />;

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

export default AdminRoute;