import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import ReportCreate from './pages/ReportCreate';
import ReportDetail from './pages/ReportDetail';

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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
