import { MOCK_ADMIN_ACCOUNT } from '../data/adminMockData';

// 백엔드 연결 전 임시 구현: 임시 관리자 계정과 비교하고 localStorage에 로그인 상태를 저장합니다.
// API가 준비되면 login 내부를 axiosInstance 호출로 바꾸고,
// 응답의 토큰과 권한(예: role === 'ADMIN')을 저장하면 됩니다.
// 예) const { data } = await axiosInstance.post('/admin/login', { username, password });

const STORAGE_KEY = 'admin-auth';

export const getAdminSession = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const isAdminLoggedIn = () => getAdminSession()?.role === 'ADMIN';

export const login = async ({ username, password }) => {
  if (username !== MOCK_ADMIN_ACCOUNT.username || password !== MOCK_ADMIN_ACCOUNT.password) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  const session = { token: 'mock-admin-token', name: MOCK_ADMIN_ACCOUNT.name, role: 'ADMIN' };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    throw new Error('로그인 정보를 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.');
  }
  return session;
};

export const logout = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소에 접근할 수 없으면 지울 것도 없음
  }
};
