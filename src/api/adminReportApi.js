import { ADMIN_MOCK_REPORTS, MOCK_USERS } from '../data/adminMockData';
import { MOCK_REPORTS, REPORT_STATUS } from '../data/mockData';

// 백엔드 연결 전 임시 구현: 학생 화면(reportApi.js)과 같은 localStorage 키를 사용해
// 학생이 작성한 신고가 관리자 화면에 보이고, 관리자가 바꾼 상태가 학생 화면에도 반영됩니다.
// API가 준비되면 각 함수 내부를 axiosInstance 호출로 바꾸면 됩니다.
// 예) const { data } = await axiosInstance.get('/admin/reports');
//     const { data } = await axiosInstance.get(`/admin/reports/${id}`);
//     const { data } = await axiosInstance.patch(`/admin/reports/${id}/status`, { status });

const STORAGE_KEY = 'facility-reports';
const SEEDED_KEY = 'facility-reports-admin-seeded';

const writeReports = (reports) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch {
    return false;
  }
};

const readReports = () => {
  let reports = MOCK_REPORTS;
  let seeded = false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) reports = JSON.parse(saved);
    seeded = localStorage.getItem(SEEDED_KEY) === 'true';
  } catch {
    // 저장소를 읽을 수 없으면 임시 데이터로 대체
  }

  // 처음 한 번만 다른 학생들의 임시 신고를 추가
  if (!seeded) {
    const ids = new Set(reports.map((r) => r.id));
    reports = [...reports, ...ADMIN_MOCK_REPORTS.filter((r) => !ids.has(r.id))];
    if (writeReports(reports)) {
      try {
        localStorage.setItem(SEEDED_KEY, 'true');
      } catch {
        // 다음에 다시 시도
      }
    }
  }
  return reports;
};

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

// 백엔드 응답에는 작성자 이름이 포함되어야 함 (현재는 임시 사용자 목록에서 조회)
const toAdminReport = (report) => ({
  ...report,
  reporterName: MOCK_USERS[report.reporterId] ?? report.reporterId,
});

export const getAdminReports = async () => readReports().sort(byNewest).map(toAdminReport);

export const getAdminReport = async (id) => {
  const report = readReports().find((r) => r.id === id);
  return report ? toAdminReport(report) : null;
};

export const getReportStats = async () => {
  const reports = readReports();
  const countOf = (status) => reports.filter((r) => r.status === status).length;
  return {
    total: reports.length,
    pending: countOf(REPORT_STATUS.PENDING),
    inProgress: countOf(REPORT_STATUS.IN_PROGRESS),
    done: countOf(REPORT_STATUS.DONE),
  };
};

export const updateReportStatus = async (id, status) => {
  if (!Object.values(REPORT_STATUS).includes(status)) {
    throw new Error('올바르지 않은 처리 상태입니다.');
  }

  const reports = readReports();
  const target = reports.find((r) => r.id === id);
  if (!target) throw new Error('신고를 찾을 수 없습니다.');

  const updated = { ...target, status };
  if (!writeReports(reports.map((r) => (r.id === id ? updated : r)))) {
    throw new Error('처리 상태를 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.');
  }
  return toAdminReport(updated);
};
