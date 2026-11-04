import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { RiArrowLeftSLine } from 'react-icons/ri';

import '../../styles/admin/admin-common.css';
import '../../styles/admin/admin-layout.css';

// 신고 목록·상세: 상단 바(뒤로가기) + 본문 + 하단 바
function AdminPageLayout() {
  const navigate = useNavigate();
  const isDetail = useMatch('/admin/reports/:id');

  // 바로 이 페이지로 들어온 경우엔 상위 화면으로 이동
  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(isDetail ? '/admin/reports' : '/admin/dashboard');
  };

  return (
    <div className="admin-page">
      <header className="admin-page-topbar">
        <button type="button" className="admin-back" onClick={handleBack} aria-label="뒤로가기">
          <RiArrowLeftSLine />
        </button>
      </header>
      <main className="admin-page-main">
        <Outlet />
      </main>
      <footer className="admin-page-footer" />
    </div>
  );
}

export default AdminPageLayout;
