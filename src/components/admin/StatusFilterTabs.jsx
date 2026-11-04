import { STATUS_FILTERS } from '../../data/mockData';

function StatusFilterTabs({ value, onChange }) {
  return (
    <div className="admin-filter-tabs">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`admin-filter-tab ${value === filter ? 'active' : ''}`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default StatusFilterTabs;
