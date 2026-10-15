import { NavLink, Outlet } from 'react-router-dom';
import { FaRegUserCircle } from 'react-icons/fa';
import { RiHome4Line, RiEditBoxLine, RiFileList3Line, RiToolsLine } from 'react-icons/ri';

import { CURRENT_USER } from '../data/mockData';
import '../styles/layout.css';

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: <RiHome4Line />, end: true },
  { to: '/reports/new', label: '신고 작성', icon: <RiEditBoxLine /> },
  { to: '/mypage', label: '내 신고', icon: <RiFileList3Line /> },
];

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <RiToolsLine />
          <span>시설 고장 신고</span>
        </NavLink>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className="sidebar-link">
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="layout-body">
        <header className="topbar">
          <div className="topbar-user">
            <FaRegUserCircle />
            {CURRENT_USER.name}
          </div>
        </header>
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
