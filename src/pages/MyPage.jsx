import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getMyReports } from '../api/reportApi';
import { STATUS_FILTERS } from '../data/mockData';
import { formatDate } from '../utils/format';
import '../styles/my-report.css';

// 내 신고: 신고 목록과 상태별 필터
function MyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const status = STATUS_FILTERS.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : '전체';

  useEffect(() => {
    getMyReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const countOf = (filter) =>
    filter === '전체' ? reports.length : reports.filter((r) => r.status === filter).length;

  const filtered = status === '전체' ? reports : reports.filter((r) => r.status === status);

  const handleFilter = (filter) => {
    setSearchParams(filter === '전체' ? {} : { status: filter });
  };

  return (
    <div>
      <h1 className="page-title">내 신고</h1>
      <p className="page-desc">내가 신고한 시설 문제의 처리 상태를 확인할 수 있습니다</p>

      <div className="status-filters">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`status-filter ${status === filter ? 'active' : ''}`}
            onClick={() => handleFilter(filter)}
          >
            {filter}
            <span className="count">{countOf(filter)}</span>
          </button>
        ))}
      </div>

      <div className="report-table-wrap card">
        <table className="report-table">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>위치</th>
              <th>상태</th>
              <th>신고일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report, index) => (
              <tr key={report.id} onClick={() => navigate(`/reports/${report.id}`)}>
                <td>{index + 1}</td>
                <td className="title-cell">{report.title}</td>
                <td>{report.place}</td>
                <td>
                  <span className="status-badge" data-status={report.status}>
                    {report.status}
                  </span>
                </td>
                <td>{formatDate(report.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="report-empty">
            <p>
              {status === '전체' ? '아직 신고한 내역이 없습니다.' : `'${status}' 상태인 신고가 없습니다.`}
            </p>
            {status === '전체' && (
              <button type="button" className="btn btn-primary" onClick={() => navigate('/reports/new')}>
                신고 작성하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
