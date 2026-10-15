import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

const Main = styled.main`
  padding: 24px;
`;

function Layout() {
  return (
    <>
      <Header>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/mypage">MyPage</Link>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default Layout;
