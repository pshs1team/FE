import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import ReportCreate from './pages/ReportCreate';
import ReportDetail from './pages/ReportDetail';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './layouts/admin/AdminLayout';
import AdminPageLayout from './layouts/admin/AdminPageLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportList from './pages/admin/AdminReportList';
import AdminReportDetail from './pages/admin/AdminReportDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/reports/new" element={<ReportCreate />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>

      {/* 관리자 */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        <Route element={<AdminPageLayout />}>
          <Route path="reports" element={<AdminReportList />} />
          <Route path="reports/:id" element={<AdminReportDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
