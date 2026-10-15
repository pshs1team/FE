import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

import { getReport } from '../api/reportApi';
import { formatDate } from '../utils/format';
import '../styles/report-detail.css';

function DetailItem({ label, children }) {
  return (
    <div className="detail-item">
      <p className="detail-label">{label}</p>
      <p className="detail-value">{children}</p>
    </div>
  );
}

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState();

  useEffect(() => {
    getReport(id).then(setReport);
  }, [id]);

  if (report === undefined) return null;

  if (report === null) {
    return (
      <div className="not-found">
        <h1 className="page-title">신고를 찾을 수 없습니다</h1>
        <p>삭제되었거나 존재하지 않는 신고입니다.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/mypage')}>
          내 신고 목록으로
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="detail-header">
        <h1 className="page-title">신고 상세</h1>
        <span className="status-badge" data-status={report.status}>
          {report.status}
        </span>
      </div>

      <section className="detail-card card">
        <h2 className="detail-card-title">시설 고장 신고</h2>

        <div className="detail-row">
          <DetailItem label="장소">
            {report.building} {report.floor} · {report.place}
          </DetailItem>
          <DetailItem label="시설">{report.facility}</DetailItem>
        </div>
        <div className="detail-row">
          <DetailItem label="상태">{report.status}</DetailItem>
          <DetailItem label="신고일">{formatDate(report.createdAt)}</DetailItem>
        </div>
        <div className="detail-row full">
          <DetailItem label="신고번호">{report.id}</DetailItem>
        </div>
        <div className="detail-row full">
          <DetailItem label="신고내용">{report.content}</DetailItem>
        </div>
        <div className="detail-row full">
          <div className="detail-item">
            <p className="detail-label">첨부사진</p>
            {report.photos.length === 0 ? (
              <p className="detail-value">첨부된 사진이 없습니다.</p>
            ) : (
              <div className="detail-photos">
                {report.photos.map((photo, index) => (
                  <div key={`${photo.name}-${index}`} className="detail-photo">
                    {photo.dataUrl && <img src={photo.dataUrl} alt={photo.name} />}
                    <span>{photo.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="detail-actions">
        <button type="button" className="btn" onClick={() => navigate('/mypage')}>
          <RiArrowLeftLine />
          목록으로
        </button>
      </div>
    </div>
  );
}

export default ReportDetail;
