import { Link } from 'react-router-dom';

function AdminLogo({ to }) {
  if (!to) return <div className="admin-logo">LOGO</div>;
  return (
    <Link to={to} className="admin-logo">
      LOGO
    </Link>
  );
}

export default AdminLogo;
