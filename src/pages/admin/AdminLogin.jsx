import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { isAdminLoggedIn, login } from '../../api/adminAuthApi';
import AdminLogo from '../../components/admin/AdminLogo';
import '../../styles/admin/admin-common.css';
import '../../styles/admin/admin-login.css';

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdminLoggedIn()) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await login({ username: username.trim(), password });
      navigate(location.state?.from ?? '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <header className="admin-login-header">
        <AdminLogo />
      </header>

      <main className="admin-login-main">
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          <input
            className="admin-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            aria-label="아이디"
            autoComplete="username"
          />
          <input
            className="admin-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            aria-label="비밀번호"
            autoComplete="current-password"
          />
          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="btn btn-primary admin-login-submit" disabled={submitting}>
            {submitting ? '로그인 중...' : '로그인'}
          </button>

          {/* 회원가입은 학생용, 비밀번호 찾기는 API 명세가 없어 아직 연결하지 않음 */}
          <div className="admin-login-links">
            <button type="button" disabled>
              회원가입
            </button>
            <button type="button" disabled>
              비밀번호 찾기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AdminLogin;
