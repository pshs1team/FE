import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>로그인</button>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}

export default Login;
