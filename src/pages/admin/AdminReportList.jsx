import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';

import { getAdminReports } from '../../api/adminReportApi';
import AdminReportTable from '../../components/admin/AdminReportTable';
import StatusFilterTabs from '../../components/admin/StatusFilterTabs';
import { STATUS_FILTERS } from '../../data/mockData';
import '../../styles/admin/admin-report-list.css';

const SEARCH_TYPES = [
  { value: 'title', label: '제목' },
  { value: 'reporterName', label: '작성자' },
];

const TABLE_COLUMNS = ['no', 'reporter', 'title', 'statusText', 'createdAt', 'attachment'];

// 신고 목록: 전체 신고 + 검색 + 상태별 필터
function AdminReportList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState(SEARCH_TYPES[0].value);
  const [keyword, setKeyword] = useState('');

  const status = STATUS_FILTERS.includes(searchParams.get('status'))
    ? searchParams.get('status')
    : '전체';

  useEffect(() => {
    getAdminReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const query = keyword.trim().toLowerCase();
  const filtered = reports
    .filter((r) => status === '전체' || r.status === status)
    .filter((r) => !query || r[searchType].toLowerCase().includes(query));

  const handleFilter = (filter) => {
    setSearchParams(filter === '전체' ? {} : { status: filter }, { replace: true });
  };

  return (
    <section className="admin-list-card">
      <div className="admin-list-header">
        <h1 className="admin-list-title">신고 목록</h1>
        <div className="admin-search">
          <div className="admin-search-type">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              aria-label="검색 기준"
            >
              {SEARCH_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <RiArrowDownSLine />
          </div>
          <label className="admin-search-input">
            <RiSearchLine />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search"
              aria-label="검색어"
            />
          </label>
        </div>
      </div>

      <StatusFilterTabs value={status} onChange={handleFilter} />

      <AdminReportTable
        reports={filtered}
        columns={TABLE_COLUMNS}
        onRowClick={(report) => navigate(`/admin/reports/${report.id}`)}
        emptyMessage={!loading && (query ? '검색 결과가 없습니다.' : '해당 상태의 신고가 없습니다.')}
        descendingNo
        variant="plain"
      />
    </section>
  );
}

export default AdminReportList;
