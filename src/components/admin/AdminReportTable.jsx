import { RiImageLine } from 'react-icons/ri';

import { REPORT_STATUS } from '../../data/mockData';
import { formatDate } from '../../utils/format';
import AdminStatusBadge from './AdminStatusBadge';

const SHORT_STATUS = {
  [REPORT_STATUS.PENDING]: '대기',
  [REPORT_STATUS.IN_PROGRESS]: '진행',
  [REPORT_STATUS.DONE]: '완료',
};

// 화면마다 필요한 열만 골라서 사용 (columns에 키 목록 전달)
const COLUMNS = {
  no: { header: 'No', render: (_, no) => no },
  reporter: { header: '작성자', render: (r) => r.reporterName },
  title: { header: '제목', className: 'admin-title-cell', render: (r) => r.title },
  // '2층 화장실'처럼 장소에 층이 이미 들어 있으면 층을 다시 붙이지 않음
  location: {
    header: '위치',
    render: (r) => (r.place.startsWith(r.floor) ? r.place : `${r.floor} ${r.place}`),
  },
  status: { header: '처리상태', render: (r) => <AdminStatusBadge status={r.status} /> },
  statusText: { header: '처리상태', render: (r) => SHORT_STATUS[r.status] },
  createdAt: { header: '작성일', render: (r) => formatDate(r.createdAt) },
  attachment: {
    header: '첨부파일',
    render: (r) => r.photos.length > 0 && <RiImageLine aria-label={`첨부파일 ${r.photos.length}개`} />,
  },
};

function AdminReportTable({ reports, columns, onRowClick, emptyMessage, descendingNo = false, variant }) {
  return (
    <div className={`admin-table-wrap ${variant ? `admin-table-${variant}` : ''}`}>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((key) => (
              <th key={key}>{COLUMNS[key].header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => {
            const no = descendingNo ? reports.length - index : index + 1;
            return (
              <tr key={report.id} data-status={report.status} onClick={() => onRowClick(report)}>
                {columns.map((key) => (
                  <td key={key} className={COLUMNS[key].className}>
                    {COLUMNS[key].render(report, no)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {reports.length === 0 && emptyMessage && <p className="admin-table-empty">{emptyMessage}</p>}
    </div>
  );
}

export default AdminReportTable;
