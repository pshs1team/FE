function AdminStatusBadge({ status }) {
  return (
    <span className="admin-status-badge" data-status={status}>
      {status}
    </span>
  );
}

export default AdminStatusBadge;
