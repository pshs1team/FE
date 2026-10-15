import { CURRENT_USER, MOCK_REPORTS, REPORT_STATUS } from '../data/mockData';
import { formatDate } from '../utils/format';

// 백엔드 연결 전 임시 구현: localStorage에 신고 목록을 저장합니다.
// API가 준비되면 각 함수 내부를 axiosInstance 호출로 바꾸면 됩니다.
// 예) const { data } = await axiosInstance.get('/reports');

const STORAGE_KEY = 'facility-reports';

const readReports = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // 저장소를 읽을 수 없으면 임시 데이터로 대체
  }
  writeReports(MOCK_REPORTS);
  return MOCK_REPORTS;
};

const writeReports = (reports) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch {
    return false;
  }
};

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

const createReportId = (reports, date) => {
  const yyyymmdd = formatDate(date.toISOString()).replaceAll('.', '');
  const sameDay = reports.filter((r) => r.id.startsWith(yyyymmdd)).length;
  return `${yyyymmdd}-${String(sameDay + 1).padStart(3, '0')}`;
};

export const getMyReports = async () =>
  readReports()
    .filter((r) => r.reporterId === CURRENT_USER.id)
    .sort(byNewest);

export const getReport = async (id) =>
  readReports().find((r) => r.id === id) ?? null;

export const createReport = async ({ building, floor, place, facility, content, photos }) => {
  const reports = readReports();
  const now = new Date();
  const report = {
    id: createReportId(reports, now),
    building,
    floor,
    place,
    facility,
    title: `${place} ${facility} 고장`,
    content,
    photos,
    status: REPORT_STATUS.PENDING,
    createdAt: now.toISOString(),
    reporterId: CURRENT_USER.id,
  };

  if (!writeReports([report, ...reports])) {
    // 사진 용량 때문에 저장 공간이 부족하면 사진 미리보기 없이 저장
    const withoutPreview = {
      ...report,
      photos: photos.map(({ name }) => ({ name, dataUrl: null })),
    };
    if (!writeReports([withoutPreview, ...reports])) {
      throw new Error('신고를 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.');
    }
    return withoutPreview;
  }
  return report;
};
