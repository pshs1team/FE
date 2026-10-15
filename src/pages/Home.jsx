import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { RiEditBoxLine, RiFileList3Line } from 'react-icons/ri';

import '../styles/home.css';

function Home() {
  return (
    <div className="home">
      <header className="home-topbar">
        <FaHome /> 홈
      </header>

      <main className="home-main">
        <div>
          <h1 className="home-title">
            교내 시설 고장
            <br />
            신고 시스템
          </h1>
          <p className="home-subtitle">고장 난 시설을 신고하고 처리 상태를 확인하세요.</p>
        </div>

        <div className="home-actions">
          <Link to="/reports/new" className="home-action">
            <RiEditBoxLine />
            신고 작성
          </Link>
          <Link to="/mypage" className="home-action">
            <RiFileList3Line />
            내 신고
          </Link>
        </div>
      </main>

      <footer className="home-footer" />
    </div>
  );
}

export default Home;
