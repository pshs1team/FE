import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAdminReport, updateReportStatus } from '../../api/adminReportApi';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { REPORT_STATUS } from '../../data/mockData';
import { formatDate } from '../../utils/format';
import '../../styles/admin/admin-report-detail.css';

// 접수(처리 대기)는 신고 작성 시 기본 상태이고, 관리자는 진행/완료로 변경
const STATUS_ACTIONS = [REPORT_STATUS.IN_PROGRESS, REPORT_STATUS.DONE];

function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminReport(id).then(setReport);
  }, [id]);

  const handleStatus = async (status) => {
    setUpdating(true);
    setError('');
    try {
      setReport(await updateReportStatus(report.id, status));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (report === undefined) return null;

  if (report === null) {
    return (
      <div className="admin-detail-card admin-not-found">
        <h1 className="admin-detail-title">신고를 찾을 수 없습니다</h1>
        <p>삭제되었거나 존재하지 않는 신고입니다.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/admin/reports')}>
          신고 목록으로
        </button>
      </div>
    );
  }

  return (
    <article className="admin-detail-card">
      <header className="admin-detail-header">
        <div className="admin-detail-heading">
          <h1 className="admin-detail-title">{report.title}</h1>
          <AdminStatusBadge status={report.status} />
        </div>
        <p className="admin-detail-meta">
          <span>
            작성자 <strong>{report.reporterName}</strong>
          </span>
          <span>
            등록일 <strong>{formatDate(report.createdAt)}</strong>
          </span>
        </p>
      </header>

      <p className="admin-detail-content">{report.content}</p>

      <div className="admin-detail-files">
        <span className="admin-detail-label">첨부파일</span>
        {report.photos.length === 0 ? (
          <span className="admin-detail-file">없음</span>
        ) : (
          <div className="admin-detail-file-list">
            {report.photos.map((photo, index) => (
              <div key={`${photo.name}-${index}`} className="admin-detail-file">
                {photo.dataUrl && <img src={photo.dataUrl} alt={photo.name} />}
                <span>{photo.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-detail-actions">
        {STATUS_ACTIONS.map((status) => (
          <button
            key={status}
            type="button"
            className={`admin-status-action ${report.status === status ? 'active' : ''}`}
            onClick={() => handleStatus(status)}
            disabled={updating || report.status === status}
            aria-pressed={report.status === status}
          >
            {status}
          </button>
        ))}
      </div>
      {error && <p className="admin-detail-error">{error}</p>}
    </article>
  );
}

export default AdminReportDetail;
