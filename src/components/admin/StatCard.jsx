function StatCard({ label, count }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-count">
        {count}
        <span>건</span>
      </p>
    </div>
  );
}

export default StatCard;
