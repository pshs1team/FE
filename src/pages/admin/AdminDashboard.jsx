import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { getAdminReports, getReportStats } from '../../api/adminReportApi';
import AdminReportTable from '../../components/admin/AdminReportTable';
import StatCard from '../../components/admin/StatCard';
import StatusFilterTabs from '../../components/admin/StatusFilterTabs';
import { REPORT_STATUS, STATUS_FILTERS } from '../../data/mockData';
import '../../styles/admin/admin-dashboard.css';

const RECENT_LIMIT = 5;

const STAT_ITEMS = [
  { key: 'total', label: '전체 신고' },
  { key: 'pending', label: REPORT_STATUS.PENDING },
  { key: 'inProgress', label: REPORT_STATUS.IN_PROGRESS },
  { key: 'done', label: REPORT_STATUS.DONE },
];

const TABLE_COLUMNS = ['no', 'reporter', 'title', 'location', 'status', 'createdAt', 'attachment'];

// 관리자 대시보드: 신고 현황 통계 + 최근 신고 목록
function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const status = STATUS_FILTERS.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : '전체';

  useEffect(() => {
    Promise.all([getAdminReports(), getReportStats()]).then(([list, counts]) => {
      setReports(list);
      setStats(counts);
      setLoading(false);
    });
  }, []);

  const recent = (status === '전체' ? reports : reports.filter((r) => r.status === status)).slice(
    0,
    RECENT_LIMIT,
  );

  const handleFilter = (filter) => {
    setSearchParams(filter === '전체' ? {} : { status: filter }, { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">대시보드</h1>

      <div className="admin-stats">
        {STAT_ITEMS.map(({ key, label }) => (
          <StatCard key={key} label={label} count={stats?.[key] ?? 0} />
        ))}
      </div>

      <section className="admin-panel">
        <h2 className="admin-panel-title">
          <Link to={status === '전체' ? '/admin/reports' : `/admin/reports?status=${status}`}>
            신고 목록
          </Link>
        </h2>
        <StatusFilterTabs value={status} onChange={handleFilter} />
        <AdminReportTable
          reports={recent}
          columns={TABLE_COLUMNS}
          onRowClick={(report) => navigate(`/admin/reports/${report.id}`)}
          emptyMessage={!loading && '해당 상태의 신고가 없습니다.'}
          variant="card"
        />
      </section>
    </div>
  );
}

export default AdminDashboard;
