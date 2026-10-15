// 백엔드 API 연결 전까지 사용하는 임시 데이터

export const CURRENT_USER = {
  id: 'student-1',
  name: '조민우',
};

export const REPORT_STATUS = {
  PENDING: '처리 대기',
  IN_PROGRESS: '처리 중',
  DONE: '처리 완료',
};

export const STATUS_FILTERS = ['전체', ...Object.values(REPORT_STATUS)];

const classrooms = (floor, count) =>
  Array.from({ length: count }, (_, i) => `${floor}-${i + 1} 교실`);

// 건물 → 층 → 장소
export const LOCATIONS = {
  본관: {
    '1층': [...classrooms(1, 8), '교무실', '보건실', '1층 화장실', '1층 복도'],
    '2층': [...classrooms(2, 8), '2층 화장실', '2층 복도'],
    '3층': [...classrooms(3, 8), '3층 화장실', '3층 복도'],
  },
  별관: {
    '1층': ['과학실', '음악실', '별관 1층 화장실'],
    '2층': ['미술실', '컴퓨터실', '도서관'],
  },
  체육관: {
    '1층': ['체육관', '탈의실', '체육관 화장실'],
  },
  운동장: {
    지상: ['운동장', '스탠드', '정문'],
  },
};

export const MOCK_REPORTS = [
  {
    id: '20260916-001',
    building: '본관',
    floor: '1층',
    place: '1-7 교실',
    facility: '교실 책상',
    title: '1-7 교실 책상 파손',
    content: '교실 책상 다리가 부러졌어요 ㅠㅠ',
    photos: [{ name: '파일명.jpeg', dataUrl: null }],
    status: REPORT_STATUS.PENDING,
    createdAt: '2026-09-16T09:00:00+09:00',
    reporterId: CURRENT_USER.id,
  },
  {
    id: '20260706-001',
    building: '본관',
    floor: '1층',
    place: '1-7 교실',
    facility: '에어컨',
    title: '1-7 에어컨 고장',
    content: '에어컨을 켜도 찬바람이 나오지 않아요.',
    photos: [],
    status: REPORT_STATUS.DONE,
    createdAt: '2026-07-06T13:20:00+09:00',
    reporterId: CURRENT_USER.id,
  },
];
